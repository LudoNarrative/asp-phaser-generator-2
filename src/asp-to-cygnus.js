/*
  This file translates the generated ASP logic into Rensa-flavored JSON. Useful for visualizing the generated ASP games, as well as for translating the generated games into Phaser code.
*/

// X(Y). --> Y is_a X.
// Example: entity(ball).
// Example: static(e1).  (Entity e1 is immovable.)
function translateIsA(str){
  var hypStart = str.indexOf("(");
  var hypEnd = str.indexOf(").");
  if (hypStart != -1 && hypEnd != -1){
    var x = str.substring(0,hypStart);
    var y = str.substring(hypStart+1,hypEnd);
    if (translateNested(y).substring(translateNested(y).indexOf(".")+1)=="draggable"){
      var entity = translateNested(y).substring(0,translateNested(y).indexOf("."));
      return {"l":[entity], "relation":"is_a", "r":["draggable"], "tags":["global"]};
    }else{
      return {"l":[translateNested(y)], "relation":"is_a", "r":[x], "tags":["global"]};
    }

  }
  return null;
}

// X(Y,Z). --> Y X Z
// Examples:
//    move_towards(entity, other)
//    move_away(entity, other)
//    move(entity, dir) where dir = north, south, east, west, northeast, etc.
//    set_color(entity,green)
function translateSimpleRelation(str){
  var hypStart = str.indexOf("(");
  var hypMid = str.indexOf(",");
  var hypEnd = str.indexOf(").");

  if (hypStart != -1 && hypMid != -1 && hypEnd != -1){
    var x = str.substring(0,hypStart);
    var y = str.substring(hypStart+1,hypMid);
    var z =str.substring(hypMid+1,hypEnd);
    return {"l":[y], "relation": x, "r": [z]};
  }
  return null;
}

// New location spec:
// add(e1,num,location(top,center))  > add num of e1 to location top center
// add(e1,num,location(middle,left))  > add num of e1 to location middle left
// add(e1,num,location(bottom,right))  > add num of e1 to location bottom right
var translateAdd=function(str, addCommand){
  var b = str.substring(addCommand+4);
  var hypStart2 = b.indexOf("(");
  var hypMidOne = b.indexOf(",");
  var next = b.substring(hypMidOne+1);
  var hypMidTwo = next.indexOf(",")

  if (hypStart2 != -1 && hypMidOne != -1 && next!=-1 && hypMidTwo!=-1){
    var y = b.substring(hypStart2+1,hypMidOne);
    var num = next.substring(0,hypMidTwo);

    var loc = b.indexOf("location(");
    if (loc!=-1){ // add(e1, num, location(top,center))
      loc += 9;
      var c = b.substring(loc);
      var cMid = c.indexOf(",");
      var cEnd = c.indexOf(")))");
      if (cMid!=-1 && cEnd !=-1){
        var row = c.substring(0,cMid);
        var col = c.substring(cMid+1,cEnd);

        return {
            "l":[translateNested(y)],
            "relation":"add_to_location",
            "r":["abstract"],
            "row": row,
            "col": col,
            "num": num, // how many of the entity to add
            "tags":["create"]

        };
      }
    }
    else{ // add(e1, num, e2)
      hypEnd = next.indexOf("))");
      z = next.substring(hypMidTwo+1,hypEnd);
      return {
          "l":[translateNested(y)],
          "relation":"add_to_location",
          "r":[translateNested(z)],
          "num": num,
          "tags":["create"]
      };
    }
  }
}

// initialize(set_X(Y,Z)). --> Y has_X Z
// Example: initialize(set_value(confidence,5)).
function translateInitialize(str){

  var addCommand = str.indexOf("(add");
  var setSpriteStart = str.indexOf("(set_sprite");
  var setColorStart = str.indexOf("(set_color");

  // Check for add command.
  if (addCommand != -1){
    return translateAdd(str, addCommand);
  }

  // Check for set_sprite command.
  else if (setSpriteStart != -1){
    var b = str.substring(setSpriteStart+10);
    var hypStart2 = b.indexOf("(");
    var hypMid = b.indexOf(",");
    var hypEnd = b.indexOf(")).");
    if (hypStart2 != -1 && hypMid != -1 && hypEnd != -1){
      var y = b.substring(hypStart2+1,hypMid);
      var z = b.substring(hypMid+1,hypEnd);
      return {"l":[translateNested(y)], "relation":"has_sprite", "r":[translateNested(z)]};
    }
  }
  // Check for set_color command.
  else if (setColorStart != -1){
    var b = str.substring(setColorStart+10);
    var hypStart2 = b.indexOf("(");
    var hypMid = b.indexOf(",");
    var hypEnd = b.indexOf(")).");
    if (hypStart2 != -1 && hypMid != -1 && hypEnd != -1){
      var y = b.substring(hypStart2+1,hypMid);
      var z = b.substring(hypMid+1,hypEnd);
      return {"l":[translateNested(y)], "relation":"set_color", "r":[translateNested(z)]};
    }
  }
  // Otherwise, check for set command.
  else{
    var hypStart = str.indexOf("(set");
    var b = str.substring(hypStart+4);
    var hypStart2 = b.indexOf("(");
    var hypMid = b.indexOf(",");
    var hypEnd = b.indexOf(")).");
    if (hypStart != -1 && hypStart2 != -1 && hypMid != -1 && hypEnd != -1){
      var y = b.substring(hypStart2+1,hypMid);
      var z = b.substring(hypMid+1,hypEnd);
      return {"l":[translateNested(y)], "relation":"set_value", "r":[translateNested(z)], "tags":["global"]};
    }
  }

  return null;
}

// Examples:
  //  - timerLogic(TIMER_ID,DURATION,single)
//  - timerLogic(TIMER_ID,DURATION,loop)
var translateTimerLogic = function(str){
  var triplet = translateTriplet(str);
  var timerID = triplet[0];
  var duration = triplet[1];
  var logicType = triplet[2];
  if (timerID!=null && duration!=null && logicType!=null){
    return {"l":[translateNested2(timerID)], "relation":"has_timer_logic", "r":[logicType], "duration": duration};
  }
  return null;
}

var translateRotates = function(str){
  var triplet = translateTriplet(str);
  var entity = triplet[0];
  var direction = triplet[1];
  var amount = triplet[2];
  if (entity!=null && direction!=null && amount!=null){
    if (direction=="ccw"){
        return {"l":[entity], "relation":"rotates", "r":[-amount]};
    }
    else if (direction=="cw"){
        return {"l":[entity], "relation":"rotates", "r":[amount]};
    }
  }
  return null;
}

var translateRotateTo = function(str){
  var entityStart = str.indexOf("(")
  var entityEnd = str.indexOf(",")
  if (entityStart!=null && entityEnd != null){
    var entity = str.substring(entityStart+1, entityEnd)
    var nums = str.substring(entityEnd+1)
    var num1Start = nums.indexOf("(")
    var num1End = nums.indexOf(",")
    var num2End = nums.indexOf(")")
    if (num1Start!=null && num1End!=null && num2End!=null){
      num1 = nums.substring(num1Start+1,num1End)
      num2 = nums.substring(num1End+1,num2End)
      var range = [parseInt(num1), parseInt(num2)]
      return {"l":[entity], "relation":"rotate_to", "r":range}
    }
  }
  return null;
}

var translateTriplet = function(str){
  var tidStart = str.indexOf("(");
  var tidEnd = str.indexOf(",");
  if (tidStart != -1 && tidEnd != -1)
  {
    var slice = str.substring(tidEnd+1);
    var durEnd = slice.indexOf(",");
    var ltEnd = slice.indexOf(")");

    if (durEnd != -1){
      var one = str.substring(tidStart+1,tidEnd);
      var two = slice.substring(0,durEnd);
      var three = slice.substring(durEnd+1,ltEnd);
      return [one, two, three];
    }
  }
  return [null,null,null];
}

var translateTickPrecondition = function(results,keyword){
  var assertionsToAdd = [];
  var rs = [];
  rs = addNormalResult(rs, results);

  // Add each result to the brain with an update tag.
  for (var i=0; i<rs.length;i++){
    var result = rs[i];
    if (result.hasOwnProperty("tags")){
      result["tags"] = result["tags"].push("update");
    }
    else{
      result["tags"] = ["update"];
    }
    result["goal_keyword"]=keyword;
    assertionsToAdd.push(result);
  }
  return assertionsToAdd;
}
/*
  Takes in a list of precondition statements and another list of the results they cause.
  Returns a list of assertions to add.

 Examples:
 1) precondition(below(confidence,5),bad_face).
    result(bad_face,set_sprite(face, upset_face)).

 2) precondition(control_event(mouse_button,pressed),gain).
    precondition(overlaps(ball,square,true),gain).
    result(gain,increases(confidence,2)).
    result(gain,change_color(square,green,1)).

 3) precondition(le(r1, med), o1).
    result(o1, increase(r1, low)).
*/
function translatePrecondition(preconds, results, keyword){
  // If this is a click control_event precondition-result pair, we'll need to initialize the listener for the mouse in the "create" function, and create a new function for the listener's callback.
  var isClickEvent = false;
  // For every precondition in preconds,
  for (i in preconds){
    if (preconds[i].indexOf("control_event(click(")>=0){
      isClickEvent=true;
    }
  }
  if (isClickEvent){
    return translateClickPrecondition(preconds,results,keyword);
  }
  // Otherwise, assume the precondition should be fed into the update function ([“update”][“outcomes”]).
   else{
     return translateUpdatePrecondition(preconds,results,keyword);
   }
};

/*
 Handles preconditions/results that occur as a result of clicking.

 Examples:
 1) precondition(control_event(click(e1)), o1).
    result(o1, add(e2, random)).
    result(o1, increase(r1, low)).
*/
var translateClickPrecondition = function(preconds,results,keyword){
  // List of assertions to push.
  assertionsToAdd = [];

  // Name of the click listener.
  var listenerName = "";

  // List of precond and result dictionaries to be added to left
  // and right concepts.
  var ps = [];
  var rs = [];

  // For every precondition in preconds,
  for (i in preconds){
    var p = preconds[i].substring(1);
    var start = p.indexOf("(");
    var mid = p.lastIndexOf("),");

    if (start != -1 && mid != -1){
      var a = p.substring(0,start);
      var bList = p.substring(start+1, mid).split(",");

      // If this is the control event, don't add to our final array of preconditions.
      if (a=="control_event"){
        // Grab the argument of the click. (Assume bList has one element).
        var argument = bList[0].substring(bList[0].indexOf("(")+1,bList[0].indexOf(")"));
        listenerName = keyword + "_"+ argument+"ClickListener";
        var clickAssertion = {"l":[listenerName],"relation":"is_a","r":["click_listener"],"for":[argument],"tags":["create"],"goal_keyword":keyword};
        assertionsToAdd.push(clickAssertion);
        ps.push(clickAssertion);

      }
      // Otherwise, push this precondition into our final array of all preconditions.
      else{
        ps = addNormalPrecond(ps, bList, a);
      }
    }
  }
  rs = addNormalResult(rs, results);

  // If we have valid preconditions and results,
  if (ps.length > 0 && rs.length > 0){
    /* Form the final assertion.
       This conditional will be stored in a function called listenerName, in the format of:
            if (each precondition in ps is true){
              execute each result in rs.
            }
    */
    assertionsToAdd.push({"l": ps,"relation":"causes","r":rs, "listener":listenerName, "goal_keyword":translateNested2(keyword)});
  }
  return assertionsToAdd;
};

/*
  Handles conditional statements that should be displayed in the update function (["updates"]["outcomes"]) of the final Phaser program.

  Examples:
  1) precondition(le(r1, med), o1).
     result(o1, increase(r1, low)).

  2) precondition(gt(health(e1), 0), o2).
     result(o2, increase(r1, low)).
     result(o2, decrease(health(e1), 1)).
*/
var translateUpdatePrecondition = function(preconds,results,keyword){
  // List of precond and result dictionaries to be added to left
  // and right concepts.
  var ps = [];
  var rs = [];

  // For every precondition in preconds,
  for (i in preconds){
    var p = preconds[i].substring(1);
    var start = p.indexOf("(");
    var mid = p.lastIndexOf("),");

    if (start != -1 && mid != -1){
      var a = p.substring(0,start);
      var bList = p.substring(start+1, mid).split(",");

      // Push this precondition into our final array of all preconditions.
      ps = addNormalPrecond(ps, bList, a);
    }
  }

  rs = addNormalResult(rs, results);

  // If we have valid preconditions and results,
  if (ps.length > 0 && rs.length > 0){
    // Form the final assertion.
    return [{"l": ps,"relation":"causes","r":rs,"goal_keyword":keyword}];
  }
  return null;
};

// Helper for translateUpdatePrecondition and translateClickPrecondition.
// Populates the list of precondition assertions.
var addNormalPrecond = function(ps, bList,a){
  // check for mouse press
  if (translateNested(bList[0])==="button(.button"){
    bList[0]="mouse_button";
    bList[1]=bList[1].replace(/\(|\)/g,'')
  }

  if (bList.length==1){
    if (a=="timerElapsed"){
        ps.push({"l":[translateNested2(bList[0])],"relation":"has_state","r":[a]});
    }
  }
  else if (bList.length==2){ // B = bList[0], C = bList[1]
    ps.push({"l":[translateNested(bList[0])],"relation":a,"r":[bList[1]]});
  }
  else if (bList.length==3){
    if (typeof bList[2] == "number"){
      ps.push({"l":[translateNested(bList[0])],"relation":a,"r":[bList[1]],"num":bList[2]});
    }
    else{
      ps.push({"l":[translateNested(bList[0])],"relation":a,"r":[bList[1]]});
    }
  }
  return ps;
};

// Helper for translateUpdatePrecondition and translateClickPrecondition.
// Populates the list of result assertions.
var addNormalResult = function(rs, results){
  // For every result in results,
  for (i in results){
    var r = results[i];
    var firstComma = r.indexOf(",");
    if (firstComma != -1){
      var r = r.substring(firstComma+1);
      var firstParen = r.indexOf("(");
      var lastParen = r.indexOf(")).");

      if (firstParen != -1 && lastParen != -1){

        var e = r.substring(0,firstParen);
        var fList = r.substring(firstParen+1,lastParen).split(",");

        if (e=="add"){
          e="add_to_location";
        }

        if (fList.length==1){
          if (e=="mode_change"){
              rs.push({"l":["game"],"relation":"set_mode","r":[fList[0]]});
          }
          else if(e=="delete"){
            rs.push({"l":[fList[0]],"relation":"action","r":["delete"]});
          }
          else if (e=="static"){
            rs.push({"l":[fList[0]],"relation":"is_a","r":[e]})
          }
        }
        // Push this result into our final array of all results.
        if (fList.length==2){ // F = fList[0], G = fList[1]
          if (e=="set"){
            e="set_value";
          }
          rs.push({"l":[translateNested(fList[0])],"relation":e,"r":[translateNested(fList[1])]});
        }
        else if (fList.length==3){
          if (e=="rotates"){
            if (fList[1]=="ccw"){
              rs.push({"l":[translateNested(fList[0])], "relation":e, "r":[-fList[2]]})
            }
            else{
              console.log({"l":[translateNested(fList[0])], "relation":e, "r":[-fList[2]]});
              rs.push({"l":[translateNested(fList[0])], "relation":e, "r":[fList[2]]})
            }
          }
          else if (e=="rotate_to"){
            var num1Start = fList[1].indexOf("(");
            if (num1Start!=null){
                var num1 = fList[1].substring(num1Start+1)
                var right = [parseInt(num1),parseInt(fList[2])]
                rs.push({"l":[fList[0]],"relation":e,"r":right});
            }
          }
          else if (typeof fList[2]=="number"){
            rs.push({"l":[translateNested(fList[0])],"relation":e,"r":[fList[1]],"num":fList[2]});
          }
          else{
            rs.push({"l":[translateNested(fList[0])],"relation": e,"r":[translateNested(fList[1])]});
          }
        }
      }
    }
  }
  return rs;
};

/*
  Assumption: only one layer of nesting, e.g., only examples like:
   > entity(e1).
   > resource(health(e1)).
 */
 // Translates e.g. "health(e1)" to "e1.health".
function translateNested(x){
  var newX = x;
  if (x.indexOf("(")>0){
    // Find inner and outer terms.
    var innerStart = x.indexOf("(");
    var innerEnd = x.indexOf(")");
    var inside = x.substring(innerStart+1,innerEnd);
    var outside = x.substring(0,innerStart);
    newX = inside+"."+outside;
  }
  return newX;
}

// Translates e.g. "health(e1)" to "e1_health".
function translateNested2(x){
  var newX = x;
  if (x.indexOf("(")>0){
    // Find inner and outer terms.
    var innerStart = x.indexOf("(");
    var innerEnd = x.indexOf(")");
    var inside = x.substring(innerStart+1,innerEnd);
    var outside = x.substring(0,innerStart);
    newX = inside+"_"+outside;
  }
  return newX;
}

// For now, assume lines is the string array of lines
// read in from the ASP file.
function translateASP(lines){
  var assertions = [];
  var doneLines = [];
  // A list of all keywords used in preconditions and results that
  // we have already addressed/translated.
  var doneKeywords = [];

  // For each line,
  for (var i in lines){
    var assertionsToAdd = null;
    // If is_a relation,
    if (isIsA(lines[i])){
      assertionsToAdd = [translateIsA(lines[i])];
      doneLines.push(lines[i]);
    }
    // If initializing values,
    else if (isInitialize(lines[i])){
      assertionsToAdd = [translateInitialize(lines[i])];
      doneLines.push(lines[i]);
    }
    // If initializing timer logic,
    else if (isTimerLogic(lines[i])){
      assertionsToAdd = [translateTimerLogic(lines[i])];
      doneLines.push(lines[i]);
    }
    // If precondition / result
    else if (isPrecondition(lines[i])){
      if (!containsObj(lines[i], doneLines)){
        var keyword = getKeyword(lines[i]);
        // If we haven't addressed this keyword,
        if (doneKeywords.indexOf(keyword)==-1){
          // Find all related preconditions and results.
          preconds = findPreconds(lines, keyword);
          results = findResults(lines, keyword);

          // Check if this is a "tick" precondition.
          var isTick = false;
          for (i in preconds){
            if (preconds[i].indexOf("tick")>=0){
              isTick=true;
            }
          }
          //If this is a "tick" precondition, it means all of the results should simply be put in the update function.
          // At this time, if a tick precondition occurs, there are no other preconditions in the group.  If this changes, we will need to alter how this works.
          if (isTick){
            assertionsToAdd = translateTickPrecondition(results, keyword);
          }
          // If this isn't a tick precondition,
          else{
            // Make and add assertion.
            assertionsToAdd = translatePrecondition(preconds, results, keyword);
          }
          // Add keyword to the list that shows we've already addressed it.
          doneKeywords.push(keyword);

          // Add all preconditions and results to doneLines.
          for (p in preconds){
            doneLines.push(preconds[p]);
          }
          for (r in results){
            doneLines.push(results[r]);
          }
        }
      }
    }
    else if (isSimpleRelation(lines[i]) && !isResult(lines[i])){
      assertionsToAdd = [translateSimpleRelation(lines[i])];
      doneLines.push(lines[i]);
    }
    // If rotates command,
    else if (isRotates(lines[i]) && !isResult(lines[i])){
      assertionsToAdd = [translateRotates(lines[i])];
      doneLines.push(lines[i]);
    }
    // If rotate_to command,
    else if (isRotateTo(lines[i]) && !isResult(lines[i])){
      assertionsToAdd = [translateRotateTo(lines[i])];
      doneLines.push(lines[i]);
    }

    // Add new assertion to final list of all assertions.
    if (assertionsToAdd != null){
      for (var k=0;k<assertionsToAdd.length;k++){
        if (assertionsToAdd[k]!=null){
            assertions.push(assertionsToAdd[k]);
        }
      }
    }
  }
  return assertions;
}

function isIsA(str){
  return str.indexOf(",") == -1;
}

function isInitialize(str){
  return str.indexOf("initialize") != -1;
}
function isPrecondition(str){
  return str.indexOf("precondition") != -1;
}
function isResult(str){
  return str.indexOf("result") != -1;
}
// X(Y,Z).
function isSimpleRelation(str){
  return /\w+\(\w+\,\w+\)\./.test(str);
}

function isTimerLogic(str){
  return str.indexOf("timerLogic") != -1;
}

function isRotates(str){
  return str.indexOf("rotates") != -1;
}
function isRotateTo(str){
  return str.indexOf("rotate_to") != -1;
}

function containsObj(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (JSON.stringify(obj) === JSON.stringify(list[i])) {
            return true;
        }
    }
    return false;
}

function findPreconds(lines, keyword){
  arr = [];
  for (var i in lines){
    if (lines[i].substring(0,lines[i].indexOf("("))=="precondition"){
      if (lines[i].substring(lines[i].lastIndexOf(",")+1,lines[i].lastIndexOf(")."))==keyword){
        arr.push(lines[i].substring(12)); // substring removes "precondition" prefix
      }
    }
  }
  return arr;
}

function findResults(lines, keyword){
  arr = [];
  for (var i in lines){
    if (lines[i].substring(0,lines[i].indexOf("("))=="result"){
      if (lines[i].substring(lines[i].indexOf("(")+1,lines[i].indexOf(","))==keyword){
        arr.push(lines[i].substring(6)); // substring removes "precondition" prefix
      }
    }
  }
  return arr;
}

var getKeyword = function(line){
  var keyword = line.substring(line.lastIndexOf(",")+1,line.lastIndexOf(")."));
  return keyword;
}

module.exports = translateASP;
