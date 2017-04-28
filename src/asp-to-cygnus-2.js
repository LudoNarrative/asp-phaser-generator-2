/*
  This file translates the generated ASP logic into Rensa-flavored JSON. Useful for visualizing the generated ASP games, as well as for translating the generated games into Phaser code.
*/

/*
  Takes in a string array, where each element of the array is a single command given by the game generator.

  Returns a list ("assertions") containing all assertions that will be added to the Cygnus brain.
*/
function translateASP(lines){
  // Final list of translated assertions.
  // Ben adding a dumb line for repo test.
  var assertions = [];

  // A list containing all translated lines.
  var doneLines = [];

  // A list of all keywords used in preconditions and results that
  // we have already addressed/translated.
  var doneKeywords = [];

  // For each line,
  for (var i in lines){
    // Temporary variable that stores the new assertions to add based on the current line we're translating.
    var assertionsToAdd = null;

    // Parse the line into its arguments.
    var terms = parseTerms(lines[i])[0][0];
    if (terms != undefined){
      if (isSimpleDeclarationPredicate(terms.predicate)){
        assertionsToAdd = [translateSimpleDeclaration(terms)];
        doneLines.push(lines[i]);
      }
      // If it is an initialize statement,
      else if (terms.predicate=="initialize"){
        terms = terms.terms[0];
        functionName = capitalizeFirstLetter(makeStandardJSName(terms.predicate));
        // Call function that corresponds to the predicate.
        // TODO: change back to window after done testing.
        // assertionsToAdd = [window['translate'+functionName](terms.terms)];
        assertionsToAdd = [eval('translate'+functionName)(terms.terms)];
        doneLines.push(lines[i]);
      }
      // If it is a timerLogic statement,
      else if (terms.predicate=="timer_logic"){
        assertionsToAdd = [translateTimerLogic(terms.terms)];
        doneLines.push(lines[i]);
      }
      // If it is a precondition,
      else if (terms.predicate=="precondition"){
        var outcome = terms.terms[1];
        // If this is a precondition with a defined string outcome (e.g. "t1"),
        if (outcome.terms){
          // This is the string inside outcome(), e.g., "t1".
          var keyword = terms.terms[1].terms[0].predicate;

          // If we haven't addressed this keyword,
          if (doneKeywords.indexOf(keyword)==-1){
            // Find all related preconditions and results.
            preconds = findPreconds(lines, keyword);
            results = findResults(lines, keyword);

            // Make and add assertion.
            assertionsToAdd = translatePrecondition(preconds, results, keyword);
          }
        }

        // Otherwise, assume this is a precondition on tick.
        // All of the results should simply be put in the update function.
        // At this time, if a tick precondition occurs, there are no other preconditions in the group.  If this changes, we will need to alter how this works.
        else{
          results = findResults(lines, "tick");

          assertionsToAdd = translateTickPrecondition(results);
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

      // Add each new assertion to final list of all assertions.
      if (assertionsToAdd != null){
        for (var k=0;k<assertionsToAdd.length;k++){
          if (assertionsToAdd[k]!=null){
              assertions.push(assertionsToAdd[k]);
          }
        }
      }
    }
  }
  return assertions;
}

/*
Translates a precondition that occurs on tick (every update).
*/
function translateTickPrecondition(results){
  var assertionsToAdd = [];
  var rs = [];
  // For each item in results, replace the first instance of "tick" with "outcome(tick)" (for consistent parsing).
  for (var i=0; i<results.length; i++){
    results[i] = results[i].replace("tick","outcome(tick)");
  }
  // Translate each result in the list.
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
    result["goal_keyword"]="tick";
    assertionsToAdd.push(result);
  }
  return assertionsToAdd;
}

/*
  Returns true if the string is a predicate for a simple declaration.
*/
function isSimpleDeclarationPredicate(str){
  return str=="entity" || str=="resource" || str=="flag";
}

/*
  Examples:
    entity(e1).   >>    e1 instance_of entity
    resource(r1). >>    r1 instance_of resource
    flag(f1).     >>    f1 instance_of flag
*/
function translateSimpleDeclaration(terms){
  var declType = terms.predicate;
  var declName = terms.terms[0].predicate;
  return {"l":[declName], "relation":"instance_of", "r":[declType], "tags":["global"]};
}

// Example: set_sprite(entity(e1),circle) >> e1 has_sprite circle
function translateSetSprite(terms){
  return translateSimpleTriple("has_sprite",terms);
}

// Example: set_color(entity(e1),green) >> e1 set_color green
function translateSetColor(terms){
  return translateSimpleTriple("set_color",terms);
}

/*
Examples:
  increase(resource(r1),scalar(6)) >> r1 increase 6
*/
function translateIncrease(terms){
  return translateSimpleTriple2("increase",terms);
}
/*
Examples:
  increase(resource(r1),scalar(6)) >> r1 increase 6
*/
function translateIncreaseOverTime(terms){
  return translateSimpleTriple2("increase_over_time",terms);
}

/*
Examples:
  decrease(resource(r1),scalar(6)) >> r1 decrease 6
*/
function translateDecrease(terms){
  return translateSimpleTriple2("decrease",terms);
}

/*
Examples:
  increase(resource(r1),scalar(6)) >> r1 increase 6
*/
function translateDecreaseOverTime(terms){
  return translateSimpleTriple2("decrease_over_time",terms);
}

/*
Examples:
  set_value(resource(r1),scalar(6)) >> r1 set_value 6
*/
function translateSetValue(terms){
  return translateSimpleTriple2("set_value",terms);
}

/*
Examples:
  set_point(entity(e1),cursor) >> r1 set_point cursor
*/
function translateSetPoint(terms){
  return translateSimpleTriple("set_point",terms);
}

/*
  Examples:
    set_bool(flag(f1),true) >> f1 set_value true
    set_bool(property(entity(e1),health),true) >> e1.health set_value true
*/
function translateSetBool(terms){
  var name = terms[0].terms[0];
  // TODO settable_bool if it is required in the final spec.
  var bool = terms[1].predicate;
  if (name.terms!=undefined){
    name = name.terms[0].predicate + "." + terms[0].terms[1].predicate;
  }
  else{
    name = name.predicate;
  }
  return {"l":[name],"relation":"set_value","r":[bool]};
}

/*
Examples:
  moves(entity(e1),north,scalar(2)) >> e1 moves north 2
*/
function translateMoves(terms){
  var name = terms[0].terms[0].predicate;
  var direction = terms[1].predicate;
  var amount = terms[2].terms[0].predicate;
  return {"l":[name],"relation":"moves","r":[direction],"num_r":[amount]};
}

/*
Examples:
  move_towards(entity(e1),cursor,scalar(2))
  >> e1 move_towards [cursor.x, cursor.y] 2
*/
function translateMoveTowards(terms){
  return translateMoveToOrAway("move_towards",terms);
}
/*
Examples:
  move_away(entity(e1),cursor,scalar(2))
  >> e1 move_away [cursor.x, cursor.y] 2
*/
function translateMoveAway(terms){
  return translateMoveToOrAway("move_away",terms);
}

// Helper for move_towards and move_away.
function translateMoveToOrAway(rel, terms){
  var name = terms[0].terms[0].predicate;
  var point = terms[1].predicate;
  if (point=="entity"){
    point=terms[1].terms[0].predicate;
  }
  var amount = terms[2].terms[0].predicate;
  // var x = point + ".x";
  // var y = point + ".y";
  // return {"l":[name],"relation":rel,"r":[x,y],"num_r":[amount]};
  return {"l":[name],"relation":rel,"r":[point],"num_r":[amount]};
}

/*
Examples:
  add(entity(e1),scalar(3),location(top,right))
  >> e1 add_to_location abstract top right 3
*/
function translateAdd(terms){
  var name = terms[0].terms[0].predicate;
  var num = terms[1].terms[0].predicate;
  var row = terms[2].terms[0].predicate;
  var col = terms[2].terms[1].predicate;
  return {
    "l":[name],"relation":"add_to_location","r":["abstract"],
    "row":row, "col": col, "num": num, "tags":["create"]
  }
}

// Example: delete(entity(e1)) >> e1 action delete
function translateDelete(terms){
  var name = terms[0].terms[0].predicate;
  return {"l":[name],"relation":"action","r":["delete"]}
}

/*
// Note: Final spec needs to clarify whether it's south or direction(south).  This will affect other commands as well.
  Example:
    set_acceleration(entity(e1),direction(south),scalar(3))
    >> e1 set_acceleration south 3
*/
function translateSetAcceleration(terms){
  var name = terms[0].terms[0].predicate;
  var direction = terms[1].terms[0].predicate;
  var num = terms[2].terms[0].predicate;
  return {"l":[name],"relation":"set_acceleration","r":[direction],"num_r":[num]};
}

// Example: set_draggable(entity(e1),true) >> e1 instance_of draggable
function translateSetDraggable(terms){
  var name = terms[0].terms[0].predicate;
  var bool = terms[1].predicate;
  // TODO: settable_bool (if required for final spec)
  if (bool=="true"){
      return {"l":[name],"relation":"instance_of","r":["draggable"],"tags":["global"]}
  }
}

// Example: set_static(entity(e1),true) >> e1 instance_of static
function translateSetStatic(terms){
  var name = terms[0].terms[0].predicate;
  var bool = terms[1].predicate;
  // TODO: settable_bool (if required for final spec)
  if (bool=="true"){
      return {"l":[name],"relation":"instance_of","r":["static"],"tags":["global"]}
  }
}

// Example: rotate_to(entity(e1), random_int(0,360))
// right = [0,360]
function translateRotateTo(terms){
  var name = terms[0].terms[0].predicate;
  var right = [parseInt(terms[1].terms[0].predicate),parseInt(terms[1].terms[1].predicate)]
  return {"l":[name],"relation":"rotate_to","r":right};
}


// Example: mode_change(game_win) >> game set_mode game_win
function translateModeChange(terms){
  return {"l":["game"],"relation":"set_mode","r":[terms[0].predicate]};
}

// Example: timer_logic(timer(t1),scalar(5),loop).
function translateTimerLogic(terms){
  var timerID = terms[0].terms[0].predicate;
  var duration = terms[1].terms[0].predicate;
  var logicType = terms[2].predicate;
  return {"l":[timerID],"relation":"has_timer_logic","r":[logicType],"duration":duration}
}

/*
  Takes in a string ("arguments"), which represents the ASP command as given by the game generator.

  Returns an array containing each predicate and term inside the argument as the first element.  (The second element is used to recursively analyze the arguments string.  At the end of the process, the second element is the empty string.)

  Example:
    JSON.stringify(parseTerms("initialize(set_sprite(e1,square)).")[0][0]) >>
    {
      "predicate":"initialize",
      "terms":[
        {
          "predicate":"set_sprite",
          "terms":[
            {
              "predicate":"entity",
              "terms":[{"predicate":"e1"}]
            },
            {"predicate":"circle"}
    ]}]}
*/
function parseTerms(arguments){
  var terms = [];
  while (arguments.length > 0){
    var lParen = arguments.indexOf("(");
    var rParen = arguments.indexOf(")");
    comma = arguments.indexOf(",");
    if (lParen < 0){
      lParen = arguments.length-1;
    }
    if (rParen < 0){
      rParen = arguments.length-1;
    }
    if (comma < 0){
      comma = arguments.length-1;
    }
    var next = Math.min(lParen,rParen,comma);
    var nextC = arguments.charAt(next);
    var pred = arguments;
    if (nextC=='('){
      pred = arguments.substring(0,next);
      var newTerms = parseTerms(arguments.substring(next+1));
      var subTerms = newTerms[0];
      arguments = newTerms[1];
      terms.push({"predicate":pred,"terms":subTerms});
    }
    else if (nextC==')'){
      pred = arguments.substring(0,next);
      if (pred != ""){
        terms.push({"predicate":pred});
      }
      arguments = arguments.substring(next+1);
      return [terms, arguments];
    }
    else if (nextC==','){
      pred = arguments.substring(0,next);
      if (pred != ""){
        terms.push({"predicate":pred});
      }
      arguments = arguments.substring(next+1);
    }
    else{
      terms.push({"predicate":pred});
      arguments = "";
    }
  }
  return [terms, ""];
}

/*
  Helper functions when there is simply a relation between two arguments.
*/
function translateSimpleTriple(rel, terms){
  var name = terms[0].terms[0].predicate;
  var property = terms[1].predicate;
  return {"l":[name],"relation":rel,"r":[property]}
}
function translateSimpleTriple2(rel, terms){
  var name = terms[0].terms[0].predicate;
  var property = terms[1].terms[0].predicate;
  return {"l":[name],"relation":rel,"r":[property]}
}

/*
  Keeps JS name standard consistent.
  Example: set_sprite => setSprite
*/
function makeStandardJSName(s){
  return s.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

/*
  Capitalizes the first letter of a string.
  Example: setSprite => SetSprite
*/
function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = translateASP;

/* Finds all preconditions in a set of lines corresponding to a keyword. */
function findPreconds(lines, keyword){
  arr = [];
  for (var i in lines){
    var terms = parseTerms(lines[i])[0][0];
    if (terms){
      if (terms.predicate != undefined){
        if (terms.predicate=="precondition"){
          var outcome = terms.terms[1];
          if (outcome.terms){
            var keyword2 = terms.terms[1].terms[0].predicate;
            if (keyword==keyword2){
              arr.push(lines[i].substring(12));
            }
          }
        }
      }
    }
  }
  return arr;
}

/*
Finds all results in a set of lines corresponding to a keyword.
*/
function findResults(lines, keyword){
  arr = [];
  for (var i in lines){
    var terms = parseTerms(lines[i])[0][0];
    if (terms){
      if (terms.predicate != undefined){
        if (terms.predicate=="result"){
          try{
            if (keyword=="tick"){
              var keyword2 = terms.terms[0].predicate;
            }
            else{
                var keyword2 = terms.terms[0].terms[0].predicate;
            }

            if (keyword==keyword2){
              arr.push(lines[i].substring(6));
            }
          }catch(err){}
        }
      }
    }
  }
  return arr;
}

/*
Translates a generic precondition.
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
 1) precondition(control_event(click(entity(e1))), outcome(o1)).
    result(outcome(o1), add(entity(e2), random)).
    result(outcome(o1), increase(resource(r1), scalar(1))).
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
        var argument = parseTerms(bList[0])[0][0].terms[0].terms[0].predicate;
        listenerName = keyword + "_"+ argument+"ClickListener";
        var clickAssertion = {"l":[listenerName],"relation":"instance_of","r":["click_listener"],"for":[argument],"tags":["create"],"goal_keyword":keyword};
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

  (Old) Examples:
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
var addNormalPrecond = function(ps, bList, a){
  // check for mouse press
  if (translateNested(bList[0])==="button(.button"){
    bList[0]="mouse_button";
    bList[1]=bList[1].replace(/\(|\)/g,'');
    ps.push({"l":[bList[0]],"relation":a,"r":[bList[1]]});
  }

  else if (bList.length==1){
    if (a=="timerElapsed"){
        ps.push({"l":[bList[0]],"relation":"has_state","r":[a]});
    }
  }
  else if (bList.length==2){ // B = bList[0], C = bList[1]
    var left = parseTerms(bList[0])[0][0].terms[0].predicate;
    var right = parseTerms(bList[1])[0][0].terms[0].predicate;
    ps.push({"l":[left],"relation":a,"r":[right]});
  }
  else if (bList.length==3){
    var left = parseTerms(bList[0])[0][0].terms[0].predicate;
    var right = parseTerms(bList[1])[0][0].terms[0].predicate;

    // TODO (if needed)
    // if (typeof bList[2] == "number"){
    //   ps.push({"l":[left],"relation":a,"r":[right],"num":bList[2]});
    // }
    // else
    if(a=="overlaps"){
      if (bList[2]=="false"){
        a = "not_"+a;
      }
      ps.push({"l":[left],"relation":a,"r":[right]});
    }
    else{
      ps.push({"l":[left],"relation":a,"r":[right]});
    }
  }
  return ps;
};

// Helper for translateUpdatePrecondition and translateClickPrecondition.
// Populates the list of result assertions.
var addNormalResult = function(rs, results){
  // For every result in results,
  for (i in results){
    var r = parseTerms(results[i].substring(1));
    var e = r[0][1].predicate;
    var fList = r[0][1].terms;

    // TODO: add more if statements for simple translates (like "translateAdd") here as needed
    if (e=="add"){
      rs.push(translateAdd(fList));
    }
    else if (e=="decrease_over_time"){
      rs.push(translateDecreaseOverTime(fList));
    }

    else if (fList.length==1){
      if (e=="mode_change"){
          rs.push({"l":["game"],"relation":"set_mode","r":[fList[0].predicate]});
      }
      else if(e=="delete"){
        rs.push({"l":[fList[0].terms[0].predicate],"relation":"action","r":["delete"]});
      }
    }
    // Push this result into our final array of all results.
    else if (fList.length==2){
      var zTerms = newTranslateNested(fList[0].terms[0]);
      if (e=="set"){
        e="set_value";
        rs.push({"l":[zTerms],"relation":e,"r":[oTerms]});
      }
      else if (e=="set_static"){
        rs.push({"l":[fList[0].terms[0].predicate],"relation":"instance_of","r":["static"]})
      }
      // Example: rotate_to(entity(e1), random_int(0,360))
      // right = [0,360]
      else if (e=="rotate_to"){
        var right = [parseInt(newTranslateNested(fList[1].terms[0])),parseInt(newTranslateNested(fList[1].terms[1]))];
        rs.push({"l":[zTerms],"relation":e,"r":right});
      }
      else{
        rs.push({"l":[zTerms],"relation":e,"r":[newTranslateNested(fList[1].terms[0])]});
      }
    }
    else if (fList.length==3){
      var zTerms = newTranslateNested(fList[0].terms[0]);

      if (e=="rotates"){
        var tTerms = fList[2].terms[0].predicate;
        if (fList[1].predicate=="ccw"){
          rs.push({"l":[zTerms], "relation":e, "r":["-" + tTerms]})
        }
        else{
          rs.push({"l":[zTerms], "relation":e, "r":[tTerms]})
        }
      }
      else if (e=="moves"){
        rs.push(translateMoves(fList));
      }
      else if (e=="move_towards"){
        rs.push(translateMoveTowards(fList));
      }
      else if (e=="move_away"){
        rs.push(translateMoveAway(fList));
      }

      // TODO (if needed)
      // else if (typeof fList[2]=="number"){
      //   rs.push({"l":[zTerms],"relation":e,"r":[oTerms],"num":fList[2].terms[0].predicate});
      // }
      // else{
      //   rs.push({"l":[zTerms],"relation": e,"r":[oTerms]});
      // }
    }
  }
  return rs;
};

// (Old) Example: Takes in {predicate: 'e1', terms: {predicate: health ...}} and returns e1.health.
// This assumes only zero or one set of terms for now.
function newTranslateNested(terms){
  var name = terms.predicate;
  if (terms.terms!=undefined){
    var property = terms.terms[0].predicate;
    return name + "." + property;
  }
  else{
    return name;
  }
}

/*
This is the old translateNested helper function.
*/
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

/*
This is the old translateNested2 helper function.
*/
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
