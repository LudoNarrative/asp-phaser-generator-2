/*
  This file translates Cygnus abstract syntax into Phaser abstract syntax.
*/

var rensa = require('./brain');

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

  // If no sprite is specified for an entity or resource, choose one at random from the Phaser brain.  (Optional step.)
  // finalBrain = addMissingSprites(finalBrain);

  // Change abstract locations (e.g. "center") to actual screen coordinates.
  finalBrain = initSpriteCoordinates(finalBrain);

  // Adjust coordinates if sprites are overlapping.
  finalBrain = preventOverlap(finalBrain);

  // Add sprites in the create method.
  finalBrain = addSprites(pID, finalBrain);

  // Add preload information.
  finalBrain = updatePreload(pID, finalBrain);

  return finalBrain;
};

var addSprites=function(pID, brain){
  var newBrain = brain.clone();
  var newProgram = JSON.parse(JSON.stringify(brain.assertions[pID]));

  for (var i in brain.assertions){
    if (exports.isRelationType(brain.assertions[i],"add_to_location")){
      newProgram["create"]["sprites"].push(brain.assertions[i]);
    }
  }
  // Update the program assertion.
  newBrain.assertions[pID] = newProgram;
  return newBrain;
};
// While sprite coordinates overlap, change their position by some random amount.
var preventOverlap = function(brain){
  var newBrain = brain.clone();
  var locationAssertions = [];
  // For each assertion in the brain,
  for (var i in brain.assertions){
    // If this contains location information (relation: add_to_location),
    if (exports.isRelationType(brain.assertions[i],"add_to_location")){
      // Add this assertion's ID to the list.
      locationAssertions.push(brain.getAssertionID(brain.assertions[i]));
    }
  }

  // Get the assertion that defines the canvas size.
  var canvasSizeID = brain.getAssertionsWith({"l":["canvasSize"],"relation":"has_value"})[0];
  var canvasSize = brain.getAssertionByID(canvasSizeID)["r"];

  var overlap = true;
  // TODO should put a check in here to ensure we don't loop infinitely.
  while(overlap){
    // For each location assertion,
    for (var j=0;j<locationAssertions.length;j++){
      // Store the current assertion ID.
      var curID = locationAssertions[j];

      // Change x and y at random for this assertion, within the bounds of the game.
      if (curID!=undefined){
        newBrain.getAssertionByID(curID).x=Math.round(Math.random() * canvasSize[0])
        newBrain.assertions[curID].y=Math.round(Math.random() * canvasSize[1])
      }

    }
    // If none are overlapping, set overlap to false.
    overlap=false;
    for (var k=0;k<locationAssertions;k++){
      var id1 = locationAssertions[k];
      for (var m=0;m<locationAssertions;m++){
        var id2 = locationAssertions[m];
        if (k != m && id1!=undefined && id2 !=undefined){
          if (isOverlap(brain,id1,id2)){
            overlap=true;
          }
        }
      }
    }

  }
  return newBrain;
};

// (TODO we need checks here to make sure the IDs found here are valid.  We're assuming the user inputs the right initial Phaser code.)
var isOverlap = function(brain, id1, id2){
  var a = brain.getAssertionByID(id1);
  var b = brain.getAssertionByID(id2);

  // Find height and width for a and b based on the sprite used.
  // The left side of a/b's assertion is the keyword.
  var aSpriteID = brain.getAssertionsWith({"l":a["l"],"relation":"has_sprite"})[0];
  var bSpriteID = brain.getAssertionsWith({"l":b["l"],"relation":"has_sprite"})[0];

  // The right side of aSpriteID and bSpriteID's assertions is_a sprite with defined width and height.  Find those assertions.
  var aSpriteName = brain.getAssertionByID(aSpriteID)["r"];
  var bSpriteName = brain.getAssertionByID(bSpriteID)["r"];

  var aSpriteDimID = brain.getAssertionsWith({"l":aSpriteName,"relation":"is_a","r":["sprite"]})[0];
  var bSpriteDimID = brain.getAssertionsWith({"l":bSpriteName,"relation":"is_a","r":["sprite"]})[0];

  var aWidth=brain.getAssertionByID(aSpriteDimID)["width"];
  var aHeight=brain.getAssertionByID(aSpriteDimID)["height"];
  var bWidth=brain.getAssertionByID(bSpriteDimID)["width"];
  var bHeight=brain.getAssertionByID(bSpriteDimID)["height"];

  // Now we can finally do the collision check.
  return !(
      ((a["y"] + aHeight) < (b["y"])) ||
      (a["y"] > (b["y"] + bHeight)) ||
      ((a["x"] + aWidth) < b["x"]) ||
      (a["x"] > (b["x"] + bWidth))
  );

}

var initSpriteCoordinates = function(brain){
  var newBrain = brain.clone();
  // For each assertion in the brain,
  for (var i in brain.assertions){
    // If this assertion is about adding a sprite to a location (add_to_location)
    if (exports.isRelationType(brain.assertions[i],"add_to_location")){
      // We need to find what general location it is (e.g. what does "center" mean for "x" and "y"?).  So, find the assertion in the brain that corresponds to "center" (the right part of the assertion).
      var coordID = brain.getAssertionsWith({"l":brain.assertions[i]["r"],"relation":"is_a","r":["location"]})[0];
      // If coordID is defined,
      if (coordID!=undefined){
        // Get x and y coordinates.
        var x = brain.getAssertionByID(coordID)["x"];
        var y = brain.getAssertionByID(coordID)["y"];
        newBrain.assertions[i]["x"] = x;
        newBrain.assertions[i]["y"] = y;
      }

    }
  }
  return newBrain;
};

var addMissingSprites=function(brain){
  var newBrain = brain.clone();
  // For each assertion in the brain,
  for (var i in brain.assertions){
    // If this assertion is about an entity or resource,
    if ((exports.isVariableAssertion(brain.assertions[i]) && brain.assertions[i].hasOwnProperty("variableType") && (brain.assertions[i]["variableType"]=="resource" || brain.assertions[i]["variableType"]=="entity")) || isVariableTypeAssertion(brain.assertions[i])){
      // Look for the associated sprite.
      var spriteID = brain.getAssertionsWith({"l":brain.assertions[i]["l"],"relation":"has_sprite"})[0];

      // If there is no sprite,
      if (spriteID==undefined){
        // Find all the sprites known by the brain that are tagged with "randomSprite".
        var randomSpriteIDs = brain.getAssertionsWith({"relation":"is_a","r":["sprite"],"tags":["randomSprite"]});

        // Choose one of these sprites at random.
        var randomSpriteID =  randomSpriteIDs[Math.floor(Math.random()*randomSpriteIDs.length)];

        var randomSprite = brain.getAssertionByID(randomSpriteID);

        // Add a new assertion to the brain with the random sprite.
        newBrain.addAssertion({"l":brain.assertions[i]["l"],"relation":"has_sprite","r":randomSprite["l"]});
      }
    }
  }
  return newBrain;
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
      var inPreload = false;
      // Check if is this sprite is already in ["preload"]["images"].
      for (var e=0; e<newProgram["preload"]["images"].length;e++){
        if (rensa.arraysEqual(newProgram["preload"]["images"][e]["r"],brain.assertions[i]["r"])&& rensa.arraysEqual(newProgram["preload"]["images"][e]["l"],brain.assertions[i]["l"])){
          inPreload=true;
        }
      }
      // Add assertion to ["preload"]["images"] if it's not already in there.
      if (!inPreload){
        newProgram["preload"]["images"].push(brain.assertions[i]);
      }

      // Remove this assertion from the brain.
      delete newBrain.assertions[i];
    }
  }
  // Update the program assertion.
  newBrain.assertions[pID] = newProgram;

  return newBrain;
};

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
    else{
      newBrain.addAssertion(cygnusBrain.assertions[i]);
    }
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
