/*
 This file generates a string containing a complete Phaser program, giving a
 brain that contains Phaser abstract syntax.
*/
var ctp = require('./cygnus-to-phaser-brain');
// Input: Phaser abstract syntax (brain).
// Output: Phaser program (string).
exports.writePhaserProgram = function(brain){
  var programText = "";
  for (var i in brain.assertions){
    /* VARIABLE INSTANTIATIONS */
    if (ctp.isVariableAssertion(brain.assertions[i])){
      programText += translateVariableAssertion(brain.assertions[i]);
    }
    /* WRITING A PROGRAM FROM A PROGRAM ASSERTION CONTAINING PHASER ABSTRACT SYNTAX */
    // We assume, for now, there is only one "program" assertion.
    else if (brain.assertions[i]["relation"]=="is_a" && brain.assertions[i]["r"].indexOf("program")>=0){
      // For each function property specified in the object (e.g. "setup"),
      for (var p in brain.assertions[i]) {
        if (brain.assertions[i].hasOwnProperty(p) && typeof brain.assertions[i][p]!=="function") {
          if (p!="l" && p!="relation" && p!="r"){
            // Write the content for that function.
            programText += "function " + p + "{";

            // For each content property specified in the function (e.g. "vars"),
            for (var c in brain.assertions[i][p]) {
              if (brain.assertions[i][p].hasOwnProperty(c)) {
                // For each assertion in the list of assertions,
                for (var a in brain.assertions[i][p][c]){
                  // Declare / change value of variables.
                  if (ctp.isVariableAssertion(brain.assertions[i][p][c][a])){
                    programText += "\n\t" + translateVariableAssertion(brain.assertions[i][p][c][a]);
                  }
                  else if (ctp.isConditionalAssertion(brain.assertions[i][p][c][a])){
                    programText += "\n\t" + translateConditionalAssertion(brain.assertions[i][p][c][a]);
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



// Convert an assertion containing a variable declaration to string.
var translateVariableAssertion = function(a){
  var str="";
  str += "var "+a["l"];
  // Set variable equal to value, if specified.
  if (a.hasOwnProperty("value")){
    str += " = "+a["value"];
  }
  str += ";\n";
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
      str+=" " + a["l"][i+1]["logicalOp"];
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
}
