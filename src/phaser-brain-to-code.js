/*
 This file generates a string containing a complete Phaser program, giving a brain that contains Phaser abstract syntax.
*/
// Change to false to remove whitespace from output.
var addWhitespace = true;

// Contains realized goals from the ASP code.
var goals;

var ctp = require('./cygnus-to-phaser-brain');
var rensa = require('./brain');

// Input: Phaser abstract syntax (brain).
// Output: Phaser program (string).
exports.writePhaserProgram = function(brain){
  var programText = "";

   goals = [];

  // Grab variable assertions so we can store their values in create.
  var variableValues = [];

  // Output variable initializations first.
  for (var i in brain.assertions){
    /* VARIABLE INSTANTIATIONS */
    if (ctp.isVariableAssertion(brain.assertions[i])){
      programText += defineVariable(brain, brain.assertions[i]);
      variableValues.push(brain.assertions[i]);
    }
    /* REALIZING GOALS */
    if (ctp.isGoalAssertion(brain.assertions[i])){
      updateAspGoals(brain, brain.assertions[i]);
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
            programText += "function " + p + "("

            // If this function has parameters, list them.
            if (brain.assertions[j][p].hasOwnProperty("params")){
              var paramsList = brain.assertions[j][p]["params"];
              for (var v=0; v<paramsList.length;v++){
                programText += paramsList[v];
                if (v<paramsList.length-1){
                  programText+=",";
                }
              }
            }
            programText += "){";

            // If this is the create function, assign any initial variable values.
            // (We assign variable values here, because outside the functions, variables like
            // game.width have not been correctly assigned yet.)
            // Also, add default values for arcade physics (like velocity), unless they have been initialized already.
            if (p==="create"){
              // Define initial values.
              if(addWhitespace){programText+="\n"};
              for (var z=0; z<variableValues.length;z++){
                var curAssert = variableValues[z];
                if (curAssert.hasOwnProperty("value")){
                  if (curAssert["value"]!==""){
                    // if(addWhitespace){programText+="\n"};
                    programText += translateVariableAssertion(brain, curAssert, false);
                  }
                }
                // If it's an entity, we need to initialize the entity as a group.
                if (curAssert.hasOwnProperty("variableType")){
                  if (curAssert["variableType"].indexOf("entity")>=0){
                    programText += translateInitGroup(curAssert);
                  }
                }
              }
              // Add any entities to the canvas.
              // For each content property specified in the function (e.g. "vars"),
              for (var d in brain.assertions[j][p]) {
                if (brain.assertions[j][p].hasOwnProperty(d)) {
                  // For each assertion in the list of assertions,
                  for (var b in brain.assertions[j][p][d]){
                    if (ctp.isRelationType(brain.assertions[j][p][d][b], "add_to_location")){
                      if (addWhitespace){programText+="\n\t";}
                      programText += translateAddSpriteAssertion(brain, brain.assertions[j][p][d][b]);
                    }
                  }
                }
              }
            }

            // Add all remaining statements.
            // For each content property specified in the function (e.g. "vars"),
            for (var c in brain.assertions[j][p]) {
              if (brain.assertions[j][p].hasOwnProperty(c)) {
                // For each assertion in the list of assertions,
                for (var a in brain.assertions[j][p][c]){
                  if (addWhitespace){programText+="\n\t";}
                  // Declare / change value of variables.
                  if (ctp.isVariableAssertion(brain.assertions[j][p][c][a])){
                    programText += translateVariableAssertion(brain, brain.assertions[j][p][c][a], true);
                  }
                  else if (ctp.isConditionalAssertion(brain.assertions[j][p][c][a])){
                    programText += translateConditionalAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isSetValueAssertion(brain.assertions[j][p][c][a])){
                    programText += translateSetValue(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "has_sprite")){
                    programText += translateHasSpriteAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "add_to_location") && p!=="create"){
                    programText += translateAddSpriteAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "action")&& brain.assertions[j][p][c][a]["r"][0].indexOf("delete")>=0){
                    programText += translateDeleteSpriteAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "set_mode")){
                    programText += translateSetMode(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "move_towards") || ctp.isRelationType(brain.assertions[j][p][c][a], "move_away")|| ctp.isRelationType(brain.assertions[j][p][c][a], "moves")){
                    programText += translateMove(brain.assertions[j][p][c][a],brain.assertions[j][p][c][a]["relation"]);
                  }
                  else if (ctp.isRelationType(brain.assertions[j][p][c][a], "apply_force")){
                    programText += translateGravity(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isGoalAssertion(brain.assertions[j][p][c][a])){
                    updateAspGoals(brain, brain.assertions[j][p][c][a]);
                  }
                  // TODO: might need isListenerAssertion at some point.
                  else if (ctp.isCallbackAssertion(brain.assertions[j][p][c][a])){
                    programText += translateListenerAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isTimerCallbackAssertion(brain.assertions[j][p][c][a])){
                    programText += translateTimerElapsedAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isMousePressedAssertion(brain.assertions[j][p][c][a])){
                    programText += translatePressedAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isDraggableAssertion(brain.assertions[j][p][c][a])){
                    programText += translateDraggableAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isOverlapAssertion(brain.assertions[j][p][c][a])){
                    programText += translateOverlapAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isStaticAssertion(brain.assertions[j][p][c][a])){
                    programText += translateStaticAssertion(brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isSetColorAssertion(brain.assertions[j][p][c][a])){
                    programText += translateSetColorAssertion(brain, brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRestitutionAssertion(brain.assertions[j][p][c][a])){
                    programText += translateRestitutionAssertion( brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRotatesAssertion(brain.assertions[j][p][c][a])){
                    programText += translateRotatesAssertion( brain.assertions[j][p][c][a]);
                  }
                  else if (ctp.isRotateToAssertion(brain.assertions[j][p][c][a])){
                    programText += translateRotateToAssertion( brain.assertions[j][p][c][a]);
                  }
                }
              }
            }

            // Add direction changes in the update function.
            if (p==="update"){
              if(addWhitespace){programText+="\n\t"};              programText += "for(var k in addedEntities) {if (addedEntities.hasOwnProperty(k)) {"
              if(addWhitespace){programText+="\n\t\t"};
              programText += "var entity = addedEntities[k];";
              if(addWhitespace){programText+="\n\t\t"};
              programText += "entity.forEach(function(item) {"
              if(addWhitespace){programText+="\n\t\t"};
              programText += "item.body.velocity.clamp(-300,300);";
              if(addWhitespace){programText+="\n\t\t\t"};
              programText += "if(item.x>game.width){item.x=game.width;}if (item.x<0){item.x=0;} if (item.y>game.height){item.y=game.height;}if (item.y<0){item.y=0;}"
              if(addWhitespace){programText+="\n\t\t"};
              programText+="}, this);"
              if(addWhitespace){programText+="\n\t"};
              programText += "}}";
              if(addWhitespace){programText+="\n"};
            }

            programText += "};";
            if (addWhitespace){programText += "\n\n"}
          }
        }
      }
    }
  }
  // Set goals variable.
  if (goals !== undefined && goals.length != 0){
    programText += "goals=[";
    for (var y=0;y<goals.length;y++){
      programText += "'"+goals[y]+"'";
      if (y<goals.length-1){
        programText+=",";
      }
    }
    programText+="];";
  }
  return programText;
};

var defineVariable = function(b,a){
  str = "";
  // If variable is a property, don't define it.
  if (a["l"][0].indexOf(".")<0){
    str = "var " + a["l"][0] + ";";
    if (addWhitespace){str+="\n";}
  }
  return str;
}

// Input: assertion to convert ("a"), brain that contains that assertion ("b")
// Convert an assertion containing a variable declaration to string.
// We're assuming here, like in most other places, that there is only one
// element in the list.
var translateVariableAssertion = function(b, a, isNewVar){
  var str="";
  if (addWhitespace){str+="\t";}
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
    if (isNewVar){str += "var ";}
    str+=a["l"][0];
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
  var str="";
  // Check if dealing with properties
  if ((a["l"][0].indexOf(".")>0 || a["r"][0].indexOf(".")>0) && !(a["l"][0].indexOf("game.")>0) && !(a["r"][0].indexOf("game.")>0)){
    if (a["l"][0].indexOf(".")>0){
      names = a["l"][0].split(".");
      // Find entity1
      entity1 = names[0];
      // Find property1
      property1 = names[1];

      if (a["r"][0].indexOf(".")>0){
        names = a["r"][0].split(".");
        // Find entity2
        entity2 = names[0];
        // Find property2
        property2 = names[1];

        /* CASE 1: If e1.property = e2.property's value, */
        str+="addedEntities['"+entity1+"'].forEach(function(item){";
        if(addWhitespace){str+="\n"};
        str+="addedEntities['"+entity2+"'].forEach(function(item2){";
        if(addWhitespace){str+="\n"};
        str+="item." + property1 + " =item2."+property2+";}, this);}, this);"
      }
      /* CASE 2: If e1.property = some_known_var_or_value, */
      else{
        entity2 = a["r"][0];
        str="addedEntities['"+entity1+"'].forEach(function(item){item." + property1 + " = "+entity2+";}, this);";
      }
    }
    /* CASE 3: If non-property variable = e2.property's value, */
    else{
      entity1 = a["l"][0];
      names = a["r"][0].split(".");
      // Find entity2
      entity2 = names[0];
      // Find property2
      property2 = names[1];

      str+="var propVal = "+a['r'][0]+";"
      if(addWhitespace){str+="\n"};
      // TODO There is probably a better way to access a group's item property.
      str+="addedEntities['"+entity2+"'].forEach(function(item){propVal=item."+property2+";}, this);";
      if(addWhitespace){str+="\n"};
      str+=a["l"][0] + "= propVal;";
    }
  }
  // Simple set value.
  else{
    if (addWhitespace){
      str=a["l"][0] + "=" + a["r"][0] + ";\n";
    }
    else{
      str=a["l"][0] + "=" + a["r"][0] + ";";
    }
  }
  return str;
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
      if (a["l"][i]["relation"]=="eq"){
        str += a["l"][i]["l"];
        str += "==";
        str+=a["l"][i]["r"];
      }
      else if (a["l"][i]["relation"]=="gt"){
        str += a["l"][i]["l"];
        str += ">";
        str+=a["l"][i]["r"];
      }
      else if (a["l"][i]["relation"]=="ge"){
        str += a["l"][i]["l"];
        str += ">=";
        str+=a["l"][i]["r"];
      }
      else if (a["l"][i]["relation"]=="lt"){
        str += a["l"][i]["l"];
        str += "<";
        str+=a["l"][i]["r"];
      }
      else if (a["l"][i]["relation"]=="le"){
        str += a["l"][i]["l"];
        str += "<=";
        str+=a["l"][i]["r"];
      }
      else if (a["l"][i]["relation"]=="near"){
        // str+= |entity2.location - entity1.location| < screen.width*0.1
        var left = a["l"][i]["l"];
        var right = a["l"][i]["r"];
        // var leftLoc = new Phaser.Point(left.x, left.y);
        // var rightLoc = new Phaser.Point(right.x, right.y);
        // var distance = Phaser.Point.distance(leftLoc,rightLoc);
        str+="Phaser.Point.distance(new Phaser.Point("+left+".x,"+left+".y),new Phaser.Point("+right+".x,"+right+".y)) < game.width*0.1";
      }
      else if (a["l"][i]["relation"]=="control_event" && a["l"][i]["l"][0]==[ 'mouse_button' ] && a["l"][i]["r"][0]==["held"]){
        str+="game.input.activePointer.leftButton.isDown";
      }
      else if (a["l"][i]["relation"]=="control_event" && a["l"][i]["l"][0]==[ 'mouse_button' ] && a["l"][i]["r"][0]==["released"]){
        str+="!game.input.activePointer.leftButton.isDown";
      }
      else{
        console.log("Error: unrecognized relation " + a["relation"] + " for conditional assertion.  \n\tFile: PhaserInterpreter.  Function: translateConditionalAssertion.");
      }


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
    if (a["r"][j]["relation"]==="set_value"){
      str+=translateSetValue(a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="add_to_location"){
      str+=translateAddSpriteAssertion(b,a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="action" && a["r"][j]["r"].indexOf("delete")>=0){
      str+=translateDeleteSpriteAssertion(b,a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="set_mode"){
      str+=translateSetMode(b,a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="move_towards" || a["r"][j]["relation"]==="move_away" || a["r"][j]["relation"]==="moves"){
      str += translateMove(a["r"][j],a["r"][j]["relation"]);
    }
    else if (a["r"][j]["relation"]==="is_a" && a["r"][j]["r"].indexOf("static")>=0){
      str+=translateStaticAssertion(a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="set_color"){
      str+=translateSetColorAssertion(b,a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="rotates"){
      str+=translateRotatesAssertion(a["r"][j]);
    }
    else if (a["r"][j]["relation"]==="rotate_to"){
      str+=translateRotateToAssertion(a["r"][j]);
    }
    if (addWhitespace){str+="\n\t";}
  }
  if (addWhitespace){str+="\t";}
  if (!emptyHypothesis){
    str+="}"
  }
  if (addWhitespace){str+="\n";}
  return str;
};

// Input: b is the full brain, a is the assertion to translate.
// Example:
// > player has_sprite sprite1
// > sprite1 is_a sprite with image: someImageName
// > game.load.image('"'+player+'"', 'assets/sprites/' + someImageName);
var translateHasSpriteAssertion=function(b, a){
  var str = "";

  // Find sprite image name.
  var spriteImgID = b.getAssertionsWith({"l":[a["r"][0]],"relation":"is_a","r":["sprite"]});

  // If the image name exists, add the appropriate preload message for the sprite.
  if (spriteImgID!=undefined && b.assertions[spriteImgID]!=undefined){
    if (b.assertions[spriteImgID]["image"]){
      var img = b.assertions[spriteImgID]["image"];
      str+= "game.load.image('" + a["l"][0] + "','assets/sprites/"+img+"');"
      if (addWhitespace){str+="\n";}
    }
  }
  return str;
}

/* Example: Init new group entity */
// e1 = game.add.physicsGroup();
// addedEntities['e1'] = e1;
// initEntityProperties(e1);
var translateInitGroup=function(a){
  var str="";
  if (addWhitespace){str+="\n\t";}
  str+= a["l"][0]+"=game.add.physicsGroup();"
  if (addWhitespace){str+="\n\t";}
  str+= "addedEntities['"+a["l"][0]+"']="+a["l"][0]+";";
  if (addWhitespace){str+="\n\t";}
  str+="initEntityProperties("+a["l"][0]+");";
  if (addWhitespace){str+="\n";}
  return str;
};

/* Example: Add single entity */
// addedEntities['e1'].create(x, y,'e1');
// updateGrid();
// initEntityProperties(addedEntities['e1']);

// Example 1:
// initialize(add(e2,10,location(top,center))).
// l: ["e2"]
// relation: "add_to_location"
// r: ["abstract"]
// num: "10"
// row: "top"
// col: "center"

// Example 2:
// initialize (add(e1, 10, e2)).
// l: ["e1"]
// relation: "add_to_location"
// r: ["e2"]
// num: "10"


var translateAddSpriteAssertion=function(b,a){
  var str="";
  var entityName = a["l"][0]; // e.g. e1
  var num = a["num"];         // e.g. 10
  var x = 0;
  var y = 0;

  // Example 1:
  // initialize(add(e2,10,location(top,center))).
  if (a["r"][0]=="abstract"){
    // Rows: top, middle, bottom
    // Cols: left, center, right
    var row = a["row"];
    var col = a["col"];

    // x and y are based on row and col
    // These values were quickly approximated and are not exact.
    if (row=="top"){
      y = 50;
    }
    else if (row=="middle"){
      y = 160;
    }
    else if (row=="bottom"){
      y = 250;
    }
    else{
      console.log("Warning: keyword " + row + " is not a known row name.");
    }

    if (col=="left"){
      x = 50;
    }
    else if (col=="center"){
      x = 190;
    }
    else if (col=="right"){
      x = 300;
    }
    else{
      console.log("Warning: keyword " + col + " is not a known col name.");
    }
    str+="var x="+x+";";
    str+="var y="+y+";";
  }

  // Example 2:
  // initialize (add(e1, 10, e2)).
  else{
    // Find coordinates of entity with name a["r"][0].
    str+="var x = 0;";
    if (addWhitespace){str+="\n\t";}
    str+="var y = 0;";
    if (addWhitespace){str+="\n\t";}
    // TODO There is probably a better way of finding group item coordinates.
    str+="addedEntities['"+a["r"][0]+"'].forEach(function(item){x=item.x;y=item.y;}, this);";
    if (addWhitespace){str+="\n\t";}

    // // Create entity at location x,y.
    // str+="for (var ii = 0; ii < "+num+"; ii++){";
    // if (addWhitespace){str+="\n\t\t";}
    // str+= "addedEntities['"+entityName+"'].create(x,y,'"+entityName+"');"
    // if (addWhitespace){str+="\n\t\t";}
    // str+= "updateGrid();";
    // if (addWhitespace){str+="\n\t\t";}
    // str+="initEntityProperties(addedEntities['"+entityName+"']);"
    // if (addWhitespace){str+="\n\t";}
    // str+="}";
  }

  // Create entity at location x,y.
  str+="for (var ii = 0; ii < "+num+"; ii++){";
  if (addWhitespace){str+="\n\t\t";}

  // (Add some randomness.)
  str+="x+=(Math.random() * 100)-50;";
  if (addWhitespace){str+="\n\t\t";}
  str+="y+=(Math.random() * 100)-50;";
  if (addWhitespace){str+="\n\t\t";}

  str+= "addedEntities['"+entityName+"'].create(x,y,'"+entityName+"');"
  if (addWhitespace){str+="\n\t\t";}
  str+= "updateGrid();";
  if (addWhitespace){str+="\n\t\t";}
  str+="initEntityProperties(addedEntities['"+entityName+"']);"
  if (addWhitespace){str+="\n\t";}
  str+="}";



  return str;
}

// Example: {"l":["e1"],"relation":"triggers","r":["e1ClickListener"]}
//  >> addedEntities['e1'].forEach(function(item) {
//  >> item.inputEnabled = true;
//  >> item.events.onInputDown.add(e1ClickListener, this);
//  >> }, this);
var translateListenerAssertion=function(a){
  var str="";
  str += "addedEntities['"+a["l"][0]+"'].forEach(function(item){";
  if (addWhitespace){str+="\n\t\t";}
  str +="item.inputEnabled=true;";
  if (addWhitespace){str+="\n\t\t";}
  str+="item.events.onInputDown.add("+a["r"][0]+",this);";
  if (addWhitespace){str+="\n\t";}
  str+="}, this);"
  if (addWhitespace){str+="\n";}
  return str;
}

// Example: controlLogic(draggable(e1)). --> e1 is_a draggable -->
// >>e1.inputEnabled = true;
// >>e1.input.enableDrag(true);
var translateDraggableAssertion=function(a){
  var str="";
  str += "addedEntities['"+a["l"][0]+"'].forEach(function(item){";
  if (addWhitespace){str+="\n\t\t";}
  str += "item.inputEnabled=true;";
  if (addWhitespace){str+="\n\t\t";}
  str += "item.input.enableDrag(true);";
  if (addWhitespace){str+="\n\t";}
  str+="}, this);"
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

// tempPoint.x = other.x-entity.x;
// tempPoint.y = other.y-entity.y;
// tempPoint.normalize();
// tempPoint.x *= 100;
// tempPoint.y *= 100;
// entity.body.velocity.x *= 0.1;
// entity.body.velocity.y *= 0.1;
// entity.movementProfile(entity, tempPoint)
var translateMove = function(a, move_type){
  str = "";
  str+= "addedEntities['"+a["l"][0]+"'].forEach(function(item) {";
  if (addWhitespace){str+="\n\t\t";}
  // if move_toward(entity, other) or move_away(entity, other)
  if (move_type==="move_towards" || move_type==="move_away"){
    // if a["r"][0]==="cursor", change it to to "game.input.mousePointer"
    var other = a["r"][0];
    if (other==="cursor"){
      other="game.input.mousePointer";
    }
    else{
      str+= "addedEntities['"+other+"'].forEach(function(item2) {";
      other="item2";
      if (addWhitespace){str+="\n\t\t";}
    }
    str += "var tempPoint = new Phaser.Point("+other+".x-item.x,"+other+".y-item.y);";
    if (addWhitespace){str+="\n\t\t";}
    str+="tempPoint.normalize();"
    if (addWhitespace){str+="\n\t\t";}
    str+="tempPoint.x *= 100;"
    if (addWhitespace){str+="\n\t\t";}
    str+="tempPoint.y *= 100;"
    if (addWhitespace){str+="\n\t\t";}
    str+="item.body.velocity.x *= 0.1;";
    if (addWhitespace){str+="\n\t\t";}
    str+="item.body.velocity.y *= 0.1;"
    if (addWhitespace){str+="\n\t\t";}
    str+=move_type+"(item, tempPoint);";
    if (addWhitespace){str+="\n";}
    if (other=="item2"){
      str+="}, this);"
      if (addWhitespace){str+="\n";}
    }
  }
  // Otherwise, assume move(entity, direction)
  else{
    // str+="moves(";
    if (a["r"][0]==="north"){
      // move(entity, 0, -1);
      str += "moves(item,0,-1);"
    }
    else if (a["r"][0]==="south"){
      str += "moves(item,0,1);"
    }
    else if (a["r"][0]==="east"){
      str += "moves(item,1,0);"
    }
    else if (a["r"][0]==="west"){
      str += "moves(item,-1,0);"
    }
    else if (a["r"][0]==="northeast"){
      // move(entity, 0, -1);
      str += "moves(item,1,-1);"
    }
    else if (a["r"][0]==="northwest"){
      str += "moves(item,-1,-1);"
    }
    else if (a["r"][0]==="southeast"){
      str += "moves(item,1,1);"
    }
    else if (a["r"][0]==="southwest"){
      str += "moves(item,-1,1);"
    }
    else if (a["r"][0]==="forward"){
      str += "move_forward(item,1);"
    }
    else if (a["r"][0]==="backward"){
      str += "move_backward(item,1);"
    }
    else if (a["r"][0]==="left"){
      str += "move_left(item,1);"
    }
    else if (a["r"][0]==="right"){
      str += "move_right(item,1);"
    }
    if (addWhitespace){str+="\n";}
  }

  str+="}, this);"
  if (addWhitespace){str+="\n";}
  return str;
}

// TODO: there are no examples beyond setting gravity to -mid at this
// time, but we should really store gravity value in the Cygnus brain.
var translateGravity = function(a){
  var str="";
  var entity = a["l"][0];
  str+= entity+".forEach(function(item){item.body.gravity.y = mid;}, this);"
  if (addWhitespace){str+="\n";}
  return str;
}

var translateDeleteSpriteAssertion = function(b, a){
  var str ="";
  var entity = a["l"][0];
  str+= entity+".destroy();"
  if (addWhitespace){str+="\n";}
  return str;
}

var translateSetMode = function(b,a){
  var str="";
  var newMode = a["r"][0];
  str+="changeMode('" + newMode +"');"
  if (addWhitespace){str+="\n";}
  return str;
}

var updateAspGoals = function(b, a){
  // For each element of left...
  for (var i=0;i<a["l"].length;i++){
    // This is the natural text translation of the ASP goal.
    var realizedGoal = "";
    // This is the string that specifies the ASP goal.
    var left = a["l"][i];
    // Goal types: "achieve", "prevent", "maintain"
    var goalType = left.substring(left.indexOf(".")+1);
    // Goal objects are resources (e.g. "r1") or precondition keywords (e.g. "o1").
    var goalObj = left.substring(0,left.indexOf("."));
    // If it's a precondition keyword, we have to find the preconditions.
    if (goalObj.indexOf("o")===0){
      var goalObjIDsOne = b.getAssertionsWith({"goal_keyword":goalObj});
      var goalObjsOne = [];
      for (var z=0; z<goalObjIDsOne.length;z++){
        goalObjsOne.push(b.getAssertionByID(goalObjIDsOne[z]))
      }

      /* Now we need to get any preconditions in the program assertion... */
      var goalObjsTwo = [];
      // First, retrieve the program assertion.  There can only be one!
      var pID = b.getAssertionsWith({"relation":"is_a","r":["program"]})[0];
      var pAssert = b.getAssertionByID(pID);
      // For each assertion in pAssert,
      for (var p in pAssert) {
          if (pAssert.hasOwnProperty(p) && typeof pAssert[p]!=="function") {
            if (p!="l" && p!="relation" && p!="r"){
            for (var c in pAssert[p]) {
              if (pAssert[p].hasOwnProperty(c)) {

                for (var e=0;e<pAssert[p][c].length;e++){
                  if (pAssert[p][c][e].hasOwnProperty("goal_keyword")){                                        if (pAssert[p][c][e]["goal_keyword"]===goalObj){
                      goalObjsTwo.push(pAssert[p][c][e]);
                    }
                  }
                }
              }
            }
          }
        }
      }

      // var goalObjIDsTwo = b.getAssertionsWith({"goal_keyword":goalObj});
      // merge one and two
      var goalObjs = goalObjsOne.concat(goalObjsTwo);

      for (var j=0;j<goalObjs.length;j++){
        var assert = goalObjs[j];

        preconds = assert["l"];
        realizedGoal = goalType.charAt(0).toUpperCase() + goalType.substr(1).toLowerCase() + ":"
        for (var k=0; k<preconds.length; k++){
          var pre = rensa.prettyprint(preconds[k],false);
          pre = pre.replace(/['"]+/g, '');
          realizedGoal += pre;
          if (k<preconds.length-1){
            realizedGoal+=",";
          }
        }
      }
    }
    // Otherwise, if it's a resource, simply state the resource.
    else if (goalObj.indexOf("r")===0){
      realizedGoal = goalType.charAt(0).toUpperCase() + goalType.substr(1).toLowerCase() + " " + goalObj;
    }
    else {
      console.log("ERROR: Unrecognized goal object.")
    }
    // Add the realized goal to the "goals" array.
    if (realizedGoal !== ""){
      goals.push(realizedGoal);
    }
  }
}

// e.g. {"l":["e1"],"relation":"overlaps","r":["e2"],"goal_keyword":"o3"}
var translateOverlapAssertion = function(a){
  var str="";
  var e1 = a['l'][0];
  var e2 = a['r'][0];
  var callback = a['goal_keyword'] + "OverlapHandler";

  str+="game.physics.arcade.overlap(addedEntities['"+e1+"'],addedEntities['"+e2+"'],"+callback+",null, this);"
  return str;
}

var translatePressedAssertion = function(a){
  var str = "";
  var callback = a['goal_keyword'] + "PressedHandler";
  str += "game.input.onDown.add("+callback+", this);"
  return str;
}

var translateTimerElapsedAssertion = function(b,a){
  var str = "";
  // Get timer id.
  var timerID = a["l"][0];
  // Find timer logic assertion ID.
  var timerLogicID = b.getAssertionsWith({"l":[timerID],"relation":"has_timer_logic"})

  if (timerLogicID != undefined){
    // Get the timer logic assertion.
    var timerLogicAssert = b.getAssertionByID(timerLogicID);
    if (timerLogicAssert.hasOwnProperty("duration")){
      var goal_keyword = a["goal_keyword"];
      var callback = goal_keyword + "_" + timerID + "Listener";
      var duration = timerLogicAssert["duration"];
      var logicType = timerLogicAssert["r"][0];

      // Add code based on timer logic assertion data.
      if (logicType=="single"){
          str+="game.time.events.add(Phaser.Timer.SECOND*"+duration+", "+callback+", this);";
      }
      else if (logicType=="loop"){
        str+="game.time.events.loop(Phaser.Timer.SECOND*"+duration+", "+callback+", this);";
      }
    }
  }
  if(addWhitespace){str+="\n"};
  return str;
}

var translateStaticAssertion = function(a){
  return "addedEntities['"+a["l"][0]+"'].forEach(function(item){item.immovable=true;}, this);";
}

var translateSetColorAssertion = function(b,a){
  str = "";
  var entityName = a["l"][0];
  var colorName = a["r"][0];
  // Find the hex code for the color.
  var colorID = b.getAssertionsWith({"l":[colorName],"relation":"is_a","r":["color"]})[0];
  if (colorID!=undefined){
    var hexcode = b.getAssertionByID(colorID)["value"];
    str+= "addedEntities['"+entityName+"'].forEach(function(item){item.tint="+hexcode+";}, this);";
  }
  return str;
}

var translateRotatesAssertion = function(a){
  str = "";
  var entityName = a["l"][0];
  var amount = a["r"][0];
  str+="addedEntities['"+entityName+"'].forEach(function(item){item.angle += "+amount+";}, this);";
  return str;
}

var translateRotateToAssertion = function(a){
  str = "";
  var entityName = a["l"][0];
  var range = a["r"];
  str+="addedEntities['"+entityName+"'].forEach(function(item){item.angle = Math.random() * ("+range[1]+"-" + range[0] +") + "+range[0]+";}, this);";
  return str;
}

var translateRestitutionAssertion = function(a){
  str = "";
  var e1 = a["l"][0];
  var e2 = a["r"][0];
  str+="game.physics.arcade.collide("+e1+","+e2+",null,null,this);"  
  return str;
}
