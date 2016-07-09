/*
 This file generates a string containing a complete Phaser program, giving a
 brain that contains Phaser abstract syntax.
*/
var addWhitespace = false;
var ctp = require('./cygnus-to-phaser-brain');
// Input: Phaser abstract syntax (brain).
// Output: Phaser program (string).
exports.writePhaserProgram = function(brain){
  var programText = "";
  // Output variable initializations first.
  for (var i in brain.assertions){
    /* VARIABLE INSTANTIATIONS */
    if (ctp.isVariableAssertion(brain.assertions[i])){
      programText += translateVariableAssertion(brain, brain.assertions[i]);
    }
  }
  // Now write functions.
  for (var j in brain.assertions){
    /* DEFINED FUNCTIONS */
    if (ctp.isFunctionAssertion(brain.assertions[j])){
      programText += translateFunctionAssertion(brain.assertions[j]);
    }
    /* WRITING A PROGRAM FROM A PROGRAM ASSERTION CONTAINING PHASER ABSTRACT SYNTAX */
    // We assume, for now, there is only one "program" assertion.
    else if (brain.assertions[j]["relation"]=="is_a" && brain.assertions[j]["r"].indexOf("program")>=0){
      // For each function property specified in the object (e.g. "create"),
      for (var p in brain.assertions[j]) {
        if (brain.assertions[j].hasOwnProperty(p) && typeof brain.assertions[j][p]!=="function") {
          if (p!="l" && p!="relation" && p!="r"){
            // Write the content for that function.
            programText += "function " + p + "(){";

            // For each content property specified in the function (e.g. "vars"),
            for (var c in brain.assertions[j][p]) {
              if (brain.assertions[j][p].hasOwnProperty(c)) {
                // For each assertion in the list of assertions,
                for (var a in brain.assertions[j][p][c]){
                  if (addWhitespace){programText+="\n\t";}
                  // Declare / change value of variables.
                  if (ctp.isVariableAssertion(brain.assertions[j][p][c][a])){
                    programText += translateVariableAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isConditionalAssertion(brain.assertions[j][p][c][a])){
                    programText += translateConditionalAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "has_sprite")){
                    programText += translateHasSpriteAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "add_to_location")){

                    programText += translateAddSpriteAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  // TODO: might need isListenerAssertion at some point.
                  else if (ctp.isCallbackAssertion(brain.assertions[j][p][c][a])){
                    programText += translateListenerAssertion(brain.assertions[j][p][c][a]);
                  }
                }
              }
            }

            programText += "};";
            if (addWhitespace){programText += "\n\n"}
          }
        }
      }
    }
  }
  return programText;
};


// Input: assertion to convert ("a"), brain that contains that assertion ("b")
// Convert an assertion containing a variable declaration to string.
// We're assuming here, like in most other places, that there is only one
// element in the list.
var translateVariableAssertion = function(b, a){
  var str="";
  // If this is an attribute (e.g. "e1.health")
  if (a["l"][0].indexOf(".")>=0){
    // Make sure there is a value defined (for e.g. "e1.health"),
    // and also make sure that e1 is a defined variable.
    var parent = a["l"][0].substring(0,a["l"][0].indexOf("."))
    if (a.hasOwnProperty("value") && b.getAssertionsWith({"l":[parent],"relation":"is_a","r":["variable"]}).length>0){
      // TODO deal with hash
      str += a["l"][0]+"="+a["value"]+";";
      if (addWhitespace){str+="\n";}
    }
  }
  // If this isn't an attribute (e.g. "e1")
  else{
    str += "var "+a["l"][0];
    // Set variable equal to value, if specified.
    if (a.hasOwnProperty("value")){
      // if value is a {}, set appropriately
      if (!(a["value"] instanceof Array) && typeof a["value"]  === "object"){
        var size = Object.keys(a["value"]).length;
        str += "={";
        var count = 0;
        for (var k in a["value"]){
          if (a["value"].hasOwnProperty(k)){
            str += "'" + k + "':'" + a["value"][k] + "'";
            count+=1;
            if (count<size){str+=",";}
          }
        }
        str +="}"
      }
      // Otherwise,
      else{
          str += "="+a["value"];
      }
    }
    str += ";";
    if (addWhitespace){str+="\n";}
  }
  return str;
}

// Convert an assertion that changes the value of a variable to string.
var translateSetValue = function(a){
  if (addWhitespace){
    return a["l"] + "=" + a["r"] + ";\n";
  }
  else{
    return a["l"] + "=" + a["r"] + ";";
  }
}

// Convert an assertion containing a conditional to string.
var translateConditionalAssertion = function(b,a){
  var str="";

  var emptyHypothesis = false;
  if (a["l"].length < 1){
    emptyHypothesis = true;
  }

  /* Formulate hypothesis. */
  if (!emptyHypothesis){
    str += "if(";
    // Add each assertion in the hypothesis.
    for (var i=0; i< a["l"].length;i++){
      str += a["l"][i]["l"];
      if (a["l"][i]["relation"]=="gt"){
        str += ">";
      }
      else if (a["l"][i]["relation"]=="ge"){
        str += ">=";
      }
      else if (a["l"][i]["relation"]=="lt"){
        str += "<";
      }
      else if (a["l"][i]["relation"]=="le"){
        str += "<=";
      }
      else{
        console.log("Error: unrecognized relation " + a["relation"] + " for conditional assertion.  \n\tFile: PhaserInterpreter.  Function: translateConditionalAssertion.");
      }
      str+=a["l"][i]["r"];

      if (i <a["l"].length-1){
        str+=" " + a["l"][i+1]["logicalOp"] + " ";
      }
    }
    str+="){";
    if (addWhitespace){str+="\n";}
  }

  /* Formulate conclusion. */
  // Add each assertion in the conclusion.
  if (!emptyHypothesis && addWhitespace){str+="\t\t";}
  for (var j=0; j<a["r"].length;j++){
    if (a["r"][j]["relation"]=="set_value"){
      str+=translateSetValue(a["r"][j]);
    }
    else if (a["r"][j]["relation"]=="add_to_location"){
      str+=translateAddSpriteAssertion(b,a["r"][j]);
    }
    if (addWhitespace){str+="\t";}
  }
  if (!emptyHypothesis && addWhitespace){
    str+="\t}"
  }
  if (addWhitespace){str+="\n";}
  return str;
};

// Input: b is the full brain, a is the assertion to translate.
// Example:
// > player has_sprite sprite1
// > sprite1 is_a sprite with image: someImageName
// > game.load.image('"'+player+'"', 'assets/' + someImageName);
var translateHasSpriteAssertion=function(b, a){
  var str = "";

  // Find sprite image name.
  var spriteImgID = b.getAssertionsWith({"l":[a["r"][0]],"relation":"is_a","r":["sprite"]});

  // If the image name exists, add the appropriate preload message for the sprite.
  if (spriteImgID!=undefined && b.assertions[spriteImgID]!=undefined){
    if (b.assertions[spriteImgID]["image"]){
      var img = b.assertions[spriteImgID]["image"];
      str+= "game.load.image('" + a["l"][0] + "','assets/"+img+"');"
      if (addWhitespace){str+="\n";}
    }
  }
  return str;
}

// Example: player = game.add.sprite(playerX, playerY, 'playerSpriteName');
var translateAddSpriteAssertion=function(b,a){
  var str="";
  str+=a["l"][0]+"=game.add.sprite(" + a["x"]+","+a["y"]+ ","+ "'"+a["l"][0]+"');";
  if (addWhitespace){str+="\n";}
  return str;
}

// Example: {"l":["e1"],"relation":"triggers","r":["e1ClickListener"]}
//  >> e1.inputEnabled = true;
//  >> e1.events.onInputDown.add(e1ClickListener, this);
var translateListenerAssertion=function(a){
  var str="";
  str += a["l"][0]+".inputEnabled=true;";
  if (addWhitespace){str+="\n\t";}
  str+=a["l"][0]+".events.onInputDown.add("+a["r"][0]+",this);";
  if (addWhitespace){str+="\n";}
  return str;
}

// We assume the function has a single name.
var translateFunctionAssertion=function(a){
  var str="";
  str += "function " + a["l"][0] + "("
  count = 0;
  for (var i=0;i<a.params.length;i++){
    str+=a.params[i]
    count+=1;
    if (count<a.params.length){
      str+=","
    }
  }
  str += "){";
  if (a["lines"]!=undefined && a["lines"]!=""){
    for (var j=0;j<a["lines"].length;j++){
      if (addWhitespace){str+="\n\t";}
      str+=a.lines[j];
    }
    if (addWhitespace){str+="\n";}
  }

  str += "};";
  if (addWhitespace){str +="\n\n";}
  return str;
}
