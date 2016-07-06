/*
  This file translates Cygnus abstract syntax into Phaser abstract syntax.
*/

/*
Input:  initial Phaser abstract syntax content (brain),
        Cygnus abstract syntax (brain).

Output: Cygnus input translated into Phaser abstract syntax,
        merged with initial Phaser content (brain).
*/
exports.cygnusToPhaser = function(initialBrain,cygnusBrain){
  // Make a clone of the initial brain.
  var finalBrain = initialBrain.clone();

  // Find the ID of the assertion containing the program data.
  // For now, we assume only one program.
  // This ID should be zero.
  var pID = finalBrain.getAssertionsWith({"relation":"is_a","r":["program"]})[0];

  // Use the information from the cygnusBrain to edit the final brain.
  finalBrain = mergeInitialWithCygnus(pID, finalBrain, cygnusBrain);

  // Add preload information.
  finalBrain = updatePreload(pID, finalBrain);

  return finalBrain;
};

// Add preload information based on any "has_sprite" assertions.
// e.g. player has_sprite sprite should be an assertion in preload.
var updatePreload=function(pID, brain){
  var newBrain = brain.clone();

  // newProgram will contain any existing assertions, plus any we modify.
  var newProgram = JSON.parse(JSON.stringify(brain.assertions[pID]));

  // For each assertion in the brain,
  for (var i in brain.assertions){
    // If it's a has_sprite assertion,
    if (exports.isRelationType(brain.assertions[i],"has_sprite")){
      // Add assertion to ["preload"]["images"]
      newProgram["preload"]["images"].push(brain.assertions[i]);

      // Remove this assertion from the brain.
      delete newBrain.assertions[i];
    }
  }
  // Update the program assertion.
  newBrain.assertions[pID] = newProgram;

  return newBrain;
}


// Modify the contents of the create function inside the program data assertion.
// For now, we assume all variable setting happens in create.
// We're also assuming that any old assertions won't be repeated.
var mergeInitialWithCygnus = function(pID, initialBrain, cygnusBrain){
  // Make a clone of the initial brain.
  var newBrain = initialBrain.clone();

  // newProgram will contain any existing assertions, plus any we gain from cygnusBrain.
  var newProgram = initialBrain.assertions[pID].clone();

  // These objects temporarily store known variables from cygnusBrain.
  // {varName1:type1, varName2:type2...}
  var tempVarTypes = {};
  // {varName1:value1, varName2:value2...}
  var tempVarValues = {};

  for (var i in cygnusBrain.assertions){
    if (isVariableTypeAssertion(cygnusBrain.assertions[i])){
      tempVarTypes[cygnusBrain.assertions[i]["l"]] = cygnusBrain.assertions[i]["r"];
    }
    else if (isSetValueAssertion(cygnusBrain.assertions[i])){
      tempVarValues[cygnusBrain.assertions[i]["l"]] = cygnusBrain.assertions[i]["r"];
    }
    else if (exports.isConditionalAssertion(cygnusBrain.assertions[i])){
      // TODO add local var names for cygnusBrain.assertions[i] etc. (readability)
      var newAssertion = cygnusBrain.assertions[i].clone();
      var newLeft = [];
      var newRight = [];

      // Update each element in left array
      // > add logicalOp &&.
      for (var m in cygnusBrain.assertions[i]["l"]){
        // TODO add each property of cygnusBrain.assertions[i]["l"][m],
        // not just l, relation, r
        var newLeftA =  {"l":cygnusBrain.assertions[i]["l"][m]["l"],"relation":cygnusBrain.assertions[i]["l"][m]["relation"],"r":cygnusBrain.assertions[i]["l"][m]["r"],"logicalOp":"&&"};
        newLeft.push(newLeftA);
      }

      // Update each element in right array.
      // > increase, decrease --> set_value.
      for (var n in cygnusBrain.assertions[i]["r"]){
        var newRightA ={};
        newRightA["l"]=cygnusBrain.assertions[i]["r"][n]["l"];

        if (cygnusBrain.assertions[i]["r"][n]["relation"]=="increase"){
          newRightA["relation"]="set_value";
          // TODO fix so not assuming newRightA["l"] consists of one element
          newRightA["r"]=[newRightA["l"][0]+"+"+cygnusBrain.assertions[i]["r"][n]["r"]];
        }
        else if (cygnusBrain.assertions[i]["r"][n]["relation"]=="decrease"){
          newRightA["relation"]="set_value";
          newRightA["r"]=[newRightA["l"][0]+"-"+cygnusBrain.assertions[i]["r"][n]["r"]];
        }
        newRight.push(newRightA);
      }
      // Push the new assertion into the outcomes list.
      newProgram["update"]["outcomes"].push({
        "l": newLeft,
        "relation":"causes",
        "r": newRight
      });
    }
    // TODO other types of assertions
  }

  // Push all known variables (with/without values) into into newBrain's assertions.
  for (var k in tempVarTypes) {
    if (tempVarTypes.hasOwnProperty(k)) {
      // If we know what the value of the variable is,
      if (tempVarValues.hasOwnProperty(k)){
        newBrain.addAssertion({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k],"value":tempVarValues[k]});
        // newProgram["create"]["vars"].push({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k],"value":tempVarValues[k]});
      }
      else{
        newBrain.addAssertion({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k]});
        // newProgram["create"]["vars"].push({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k]});
      }
    }
  }

  // Update the program assertion.
  newBrain.assertions[pID] = newProgram;
  return newBrain;
};

// Check if an assertion is a variable declaration in Phaser Abstract Syntax.
exports.isVariableAssertion=function(a){
  return a["relation"]=="is_a" && (a["r"].indexOf("variable")>=0);
};

// Checks if an assertion is a variable declaration in Cygnus Abstract Syntax.
var isVariableTypeAssertion=function(a){
  return a["relation"]=="is_a" && (a["r"].indexOf("resource")>=0 || a["r"].indexOf("entity")>=0);
};

exports.isRelationType=function(a,relationType){
  return a["relation"]==relationType;
};

// Check if an assertion is setting the value of one or more concepts.
var isSetValueAssertion=function(a){
  return exports.isRelationType(a,"set_value");
};

// Check if an assertion is a conditional.
exports.isConditionalAssertion = function(a){
  return exports.isRelationType(a,"causes");
}
