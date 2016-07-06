/*
  This file translates the generated ASP logic into Rensa-flavored JSON. Useful for visualizing the generated ASP games, as well as for translating the generated games into Phaser code.
*/
// A list of all keywords used in preconditions and results that
// we have already addressed/translated.
var doneKeywords = [];

// X(Y). --> Y is_a X.
// Example: entity(ball).
function translateIsA(str){
  var hypStart = str.indexOf("(");
  var hypEnd = str.indexOf(").");
  if (hypStart != -1 && hypEnd != -1){
    var x = str.substring(0,hypStart);
    var y = str.substring(hypStart+1,hypEnd);
    return {"l":[translateNested(y)], "relation":"is_a", "r":[x], "tags":["global"]};
  }
  return null;
}

// X(Y,Z). --> Y X Z
// Note: this means physicsLogic --> hasPhysicsLogic
// Example: hasPhysicsLogic(ball,spring).
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

// initialize(set_X(Y,Z)). --> Y has_X Z
// Example: initialize(set_value(confidence,5)).
function translateInitialize(str){
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
  return null;
}


/*
  precondition(A(B,C),D). result(D,E(F,G)).
  --> {"l": [{"l":[B],"relation":A,"r":[C]}],
       "relation": "causes",
      "r": [{"l":[F],"relation":E,"r":[G]}]}

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
function translatePrecondition(preconds, results){
  // List of precond and result dictionaries to be added to left
  // and right concepts.
  ps = []
  rs = []

  // precondition(le(r1, med), o1).
  // precondition(ge(health(e1), 0), o1).

  // For every precondition in preconds,
  for (i in preconds){
    var p = preconds[i].substring(1);
    var start = p.indexOf("(");
    var mid = p.lastIndexOf("),");

    if (start != -1 && mid != -1){
      var a = p.substring(0,start);
      var bList = p.substring(start+1, mid).split(",");

      // Push this precondition into our final array of all preconditions.
      if (bList.length==2){ // B = bList[0], C = bList[1]
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
    }
  }

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

        // Push this result into our final array of all results.
        if (fList.length==2){ // F = fList[0], G = fList[1]
          rs.push({"l":[translateNested(fList[0])],"relation":e,"r":[fList[1]]});
        }
        else if (fList.length==3){
          if (typeof fList[2]=="number"){
            rs.push({"l":[translateNested(fList[0])],"relation":e,"r":[fList[1]],"num":fList[2]});
          }
          else{
            rs.push({"l":[translateNested(fList[0])],"relation": e,"r":[fList[1]]});
          }
        }
      }
    }
  }

  // If we have valid preconditions and results,
  if (ps.length > 0 && rs.length > 0){
    // Form the final assertion.
    return {"l": ps,"relation":"causes","r":rs};
  }
  return null;
}

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

// For now, assume lines is the string array of lines
// read in from the ASP file.
function translateASP(lines){
  var assertions = [];
  var doneLines = [];
  // For each line,
  for (var i in lines){
    var assertionToAdd = null;
    // If is_a relation,
    if (isIsA(lines[i])){
      assertionToAdd = translateIsA(lines[i]);
      doneLines.push(lines[i]);
    }
    // If initializing values,
    else if (isInitialize(lines[i])){
      assertionToAdd = translateInitialize(lines[i]);
      doneLines.push(lines[i]);
    }
    // If precondition / result
    else if (isPrecondition(lines[i])){
      if (!containsObj(lines[i], doneLines)){
        var keyword = lines[i].substring(lines[i].lastIndexOf(",")+1,lines[i].lastIndexOf(")."));

        // If we haven't addressed this keyword,
        if (doneKeywords.indexOf(keyword)==-1){
          // Find all related preconditions and results.
          preconds = findPreconds(lines, keyword);
          results = findResults(lines, keyword);

          // Make and add assertion.
          assertionToAdd = translatePrecondition(preconds, results);

          // Add keyword to the list that shows we've already addressed it.
          doneKeywords.push(keyword);

          // Add all preconditions and results to doneLines.
          for (p in preconds){
            doneLines.push(preconds[p])
          }
          for (r in results){
            doneLines.push(results[r])
          }
        }
      }
    }

    // Add new assertion to final list of all assertions.
    if (assertionToAdd != null){
      assertions.push(assertionToAdd);
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

module.exports = translateASP;
