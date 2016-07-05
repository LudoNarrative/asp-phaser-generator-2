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
  var finalBrain = initialBrain.clone();

  // Find the ID of the assertion containing the program data.
  var pID = finalBrain.getAssertionsWith({"relation":"is_a","r":["program"]})[0];

  // Use the information from the cygnusBrain to edit this assertion.
  finalBrain = modifyProgram(pID, initialBrain, cygnusBrain);
  return finalBrain;
};

// Modify the contents of the create function inside the program data assertion.
// For now, we assume all variable setting happens in create.
// We're also assuming that any old assertions won't be repeated.
function modifyProgram(pID, initialBrain, cygnusBrain){
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

  // Push all known variables (with/without values) into the newCreate vars array.
  for (var k in tempVarTypes) {
    if (tempVarTypes.hasOwnProperty(k)) {
      // If we know what the value of the variable is,
      if (tempVarValues.hasOwnProperty(k)){
        newProgram["create"]["vars"].push({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k],"value":tempVarValues[k]});
      }
      else{
        newProgram["create"]["vars"].push({"l":[k], "relation":"is_a", "r":["variable"],"variableType":tempVarTypes[k]});
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

// Check if an assertion is setting the value of one or more concepts.
var isSetValueAssertion=function(a){
  return a["relation"]=="set_value";
};

// Check if an assertion is a conditional.
exports.isConditionalAssertion = function(a){
  return a["relation"]=="causes";
}
