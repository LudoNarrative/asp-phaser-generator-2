/*
 This file generates a string containing a complete Phaser program, giving a
 brain that contains Phaser abstract syntax.
*/
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
  // Now write code related to the program assertion.
  for (var j in brain.assertions){
    /* WRITING A PROGRAM FROM A PROGRAM ASSERTION CONTAINING PHASER ABSTRACT SYNTAX */
    // We assume, for now, there is only one "program" assertion.
    if (brain.assertions[j]["relation"]=="is_a" && brain.assertions[j]["r"].indexOf("program")>=0){
      // For each function property specified in the object (e.g. "create"),
      for (var p in brain.assertions[j]) {
        if (brain.assertions[j].hasOwnProperty(p) && typeof brain.assertions[j][p]!=="function") {
          if (p!="l" && p!="relation" && p!="r"){
            // Write the content for that function.
            programText += "function " + p + "{";

            // For each content property specified in the function (e.g. "vars"),
            for (var c in brain.assertions[j][p]) {
              if (brain.assertions[j][p].hasOwnProperty(c)) {
                // For each assertion in the list of assertions,
                for (var a in brain.assertions[j][p][c]){
                  // Declare / change value of variables.
                  if (ctp.isVariableAssertion(brain.assertions[j][p][c][a])){
                    programText += "\n\t" + translateVariableAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isConditionalAssertion(brain.assertions[j][p][c][a])){
                    programText += "\n\t" + translateConditionalAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "has_sprite")){
                    programText += "\n\t" + translateHasSpriteAssertion(brain, brain.assertions[j][p][c][a])
                  }
                }
              }
            }

            programText += "};\n\n";
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
      str += a["l"][0]+" = "+a["value"]+";\n";
    }
  }
  // If this isn't an attribute (e.g. "e1")
  else{
    str += "var "+a["l"][0];
    // Set variable equal to value, if specified.
    if (a.hasOwnProperty("value")){
      str += " = "+a["value"];
    }
    str += ";\n";
  }
  return str;
}

// Convert an assertion that changes the value of a variable to string.
var translateSetValue = function(a){
  return a["l"] + "=" + a["r"] + ";\n";
}

// Convert an assertion containing a conditional to string.
var translateConditionalAssertion = function(a){
  var str="";

  /* Formulate hypothesis. */
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
  str+="){\n";

  /* Formulate conclusion. */
  // Add each assertion in the conclusion.
  for (var j=0; j<a["r"].length;j++){
    str+="\t\t";
    if (a["r"][j]["relation"]=="set_value"){
      str+=translateSetValue(a["r"][j]);
    }
  }
  str+="}\n"
  return str;
};

// Input: b is the full brain, a is the assertion to translate.
// Example:
// > player has_sprite sprite1
// > sprite1 is_a sprite with image: someImageName
// > game.load.image('"'+player+'"', 'sprites/' + someImageName);
var translateHasSpriteAssertion=function(b, a){
  var str = "";

  // Find sprite image name.
  var spriteImgID = b.getAssertionsWith({"l":[a["r"][0]],"relation":"is_a","r":["sprite"]});


  // If the image name exists, add the appropriate preload message for the sprite.
  if (spriteImgID!=undefined && b.assertions[spriteImgID]!=undefined){
    if (b.assertions[spriteImgID]["image"]){
      var img = b.assertions[spriteImgID]["image"];
      str+= 'game.load.image("' + a["l"][0] + '", "sprites/'+img+'");\n'
    }
  }
  return str;
}
