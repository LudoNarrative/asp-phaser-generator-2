var test = require('tape');
var fs = require('fs');
var translateASP = require('../src/asp-to-cygnus-2.js');

test('test increase/decrease', function (t) {
  var output = translateASP([
    "initialize(increase(resource(r1),scalar(3))).",
    "initialize(decrease(resource(r1),scalar(7))).",
    "initialize(increase_over_time(resource(r1),scalar(28))).",
    "initialize(decrease_over_time(resource(r1),scalar(14)))."
  ]);
  t.deepEqual([
    {"l":["r1"],"relation":"increase","r":["3"]},
    {"l":["r1"],"relation":"decrease","r":["7"]},
    {"l":["r1"],"relation":"increase_over_time","r":["28"]},
    {"l":["r1"],"relation":"decrease_over_time","r":["14"]},
  ], output);
  t.end();
});

test('test set_value', function (t) {
  var output = translateASP([
    "initialize(set_value(resource(r1),scalar(3))).",
  ]);
  t.deepEqual([
    {"l":["r1"],"relation":"set_value","r":["3"]}
  ], output);
  t.end();
});

test('test set_point', function (t) {
  var output = translateASP([
    "initialize(set_point(entity(e1),cursor)).",
  ]);
  t.deepEqual([
    {"l":["e1"],"relation":"set_point","r":["cursor"]}
  ], output);
  t.end();
});

test('test set_bool', function (t) {
  var output = translateASP([
    "initialize(set_bool(flag(f1),true)).",
    "initialize(set_bool(property(entity(e1),health),true))."
  ]);
  t.deepEqual([
    {"l":["f1"],"relation":"set_value","r":["true"]},
    {"l":["e1.health"],"relation":"set_value","r":["true"]}
  ], output);
  t.end();
});

test('test moves', function (t) {
  var output = translateASP([
    "initialize(moves(entity(e1),north,scalar(2)))."
  ]);
  t.deepEqual([
    {"l":["e1"],"relation":"moves","r":["north"],"num_r":["2"]}
  ], output);
  t.end();
});

test('test move_towards/away', function (t) {
  var output = translateASP([
    "initialize(move_towards(entity(e1),cursor,scalar(2))).",
    "initialize(move_away(entity(e1),cursor,scalar(2))).",
  ]);
  t.deepEqual([
    {"l":["e1"],"relation":"move_towards","r":["cursor"],"num_r":["2"]},
    {"l":["e1"],"relation":"move_away","r":["cursor"],"num_r":["2"]}
  ], output);
  t.end();
});

test('test add entity to a location', function (t) {
  var output = translateASP([
    "initialize(add(entity(e1),scalar(3),location(top,right)))."
  ]);
  t.deepEqual([
    {
      "l":["e1"],"relation":"add_to_location","r":["abstract"],
      "row":"top","col":"right","num":"3","tags":["create"]
    }
  ], output);
  t.end();
});

test('test delete entity', function (t) {
  var output = translateASP([
    "initialize(delete(entity(e1)))."
  ]);
  t.deepEqual([
    {
      "l":["e1"],"relation":"action","r":["delete"]
    }
  ], output);
  t.end();
});

test('test set_acceleration', function (t) {
  var output = translateASP([
    "initialize(set_acceleration(entity(e1),direction(south),scalar(3)))."
  ]);
  t.deepEqual([
    {
      "l":["e1"],"relation":"set_acceleration","r":["south"],"num_r":["3"]
    }
  ], output);
  t.end();
});

test('test set_sprite', function (t) {
  var output = translateASP([
    "initialize(set_sprite(entity(e1),circle))."
  ]);
  t.deepEqual([{"l":["e1"],"relation":"has_sprite","r":["circle"]}], output);
  t.end();
});

test('test set_color', function (t) {
  var output = translateASP([
    "initialize(set_color(entity(e1),green))."
  ]);
  t.deepEqual([{"l":["e1"],"relation":"set_color","r":["green"]}], output);
  t.end();
});

test('test rotate_to', function (t) {
  var output = translateASP([
    "initialize(rotate_to(entity(e1),random_int(0,360)))."
  ]);
  t.deepEqual([{"l":["e1"],"relation":"rotate_to","r":[0,360]}], output);
  t.end();
});

test('test mode_change', function (t) {
  var output = translateASP([
    "initialize(mode_change(game_win))."
  ]);
  t.deepEqual([{"l":["game"],"relation":"set_mode","r":["game_win"]}], output);
  t.end();
});

test('test set_static', function (t) {
  var output = translateASP([
    "initialize(set_static(entity(e1),true))."
  ]);
  t.deepEqual([{"l":["e1"],"relation":"instance_of","r":["static"],"tags":["global"]}], output);
  t.end();
});

test('test set_draggable', function (t) {
  var output = translateASP([
    "initialize(set_draggable(entity(e1),true))."
  ]);
  t.deepEqual([{"l":["e1"],"relation":"instance_of","r":["draggable"],"tags":["global"]}], output);
  t.end();
});

test('test timer outcome add', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),add(entity(e1),scalar(1),location(middle,center)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"add_to_location","r":["abstract"],"row":"middle", "col": "center", "num": "1", "tags":["create"]}]
    }
  ], output);
  t.end();
});

test('test timer outcome mode_change', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),mode_change(game_win))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["game"],"relation":"set_mode","r":["game_win"]}]
    }
  ], output);
  t.end();
});

test('test timer outcome delete', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),delete(entity(e1)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"action","r":["delete"]}]
    }
  ], output);
  t.end();
});

test('test timer outcome static', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),set_static(entity(e1),true))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"instance_of","r":["static"]}]
    }
  ], output);
  t.end();
});

test('test timer outcome rotate_to', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),rotate_to(entity(e1),random_int(0,360)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"rotate_to","r":[0,360]}]
    }
  ], output);
  t.end();
});

// Note: It's unclear in the spec what angular_direction (etc.) is supposed to be, so this test especially is an educated guess.
test('test timer outcome rotates', function (t) {
  var output = translateASP([
    "precondition(timerElapsed(t1),outcome(t1)).","result(outcome(t1),rotates(entity(e1),ccw,scalar(10)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"t1",
      "l":[{"l":["t1"],"relation":"has_state","r":["timerElapsed"]}],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"rotates","r":["-10"]}]
    }
  ], output);
  t.end();
});

test('test overlaps outcome delete/increase', function (t) {
  var output = translateASP([
    "precondition(overlaps(entity(e1),entity(e2),true),outcome(o1)).","result(outcome(o1),delete(entity(e1))).","result(outcome(o1),increase(resource(r1),scalar(11)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o1",
      "l":[{"l":["e1"],"relation":"overlaps","r":["e2"]}],
      "relation":"causes",
      "r":[
        {"l":["e1"],"relation":"action","r":["delete"]},
        {"l":["r1"],"relation":"increase","r":["11"]}
      ]
    }
  ], output);
  t.end();
});

// Again, settable_value is not defined in the spec.  I'm assuming "settable_value" actually means "settable".
test('test le outcome mode_change', function (t) {
  var output = translateASP([
    "precondition(le(resource(r1),scalar(0)),outcome(o2)).",
    "result(outcome(o2),mode_change(narrative_progression))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o2",
      "l":[{"l":["r1"],"relation":"le","r":["0"]}],
      "relation":"causes",
      "r":[{"l":["game"],"relation":"set_mode","r":["narrative_progression"]}]
    }
  ], output);
  t.end();
});

// Again, "tick" is not listed as a condition in the spec, so I am making the assumption that it could be a condition.
test('test tick outcome decrease_over_time', function (t) {
  var output = translateASP([
    "precondition(tick,tick).","result(tick,decrease_over_time(resource(r1),scalar(1)))."
  ]);
  t.deepEqual([
    {
      "l":["r1"],"relation":"decrease_over_time","r":["1"],"tags":["update"],"goal_keyword":"tick"
    }
  ], output);
  t.end();
});

test('test not_overlaps/pressed outcome increase', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,pressed)),outcome(o3)).","precondition(overlaps(entity(e1),entity(e2),false),outcome(o3)).","result(outcome(o3),increase(resource(r1),scalar(11)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o3",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["pressed"]},
        {"l":["e1"],"relation":"not_overlaps","r":["e2"]}
      ],
      "relation":"causes",
      "r":[{"l":["r1"],"relation":"increase","r":["11"]}]
    }
  ], output);
  t.end();
});

// Again, direction is not defined in the current spec.  I'm assuming something like "forward" or "north" is acceptable for the moves command.
// There is also a comment ("does value make sense here?") in the spec for the moves command with respect to the third argument of moves(). I am storing the value portion as num_r, but likely leaving it out of the overall pipeline until it is decided that is part of the command.  (Hence, this should be easy to add in later if we decide it is desirable.)
test('test tick outcome moves/decrease_over_time', function (t) {
  var output = translateASP([
    "precondition(tick,tick).",
    "result(tick,moves(entity(e1),forward,scalar(2))).",
    "result(tick,moves(entity(e2),forward,scalar(2))).",
    "result(tick,decrease_over_time(resource(r1),scalar(1)))."
  ]);
  t.deepEqual([
    {"l":["e1"],"relation":"moves","r":["forward"],"num_r":["2"],"tags":["update"],"goal_keyword":"tick"},
    {"l":["e2"],"relation":"moves","r":["forward"],"num_r":["2"],"tags":["update"],"goal_keyword":"tick"},
    {"l":["r1"],"relation":"decrease_over_time","r":["1"],"tags":["update"],"goal_keyword":"tick"}
  ], output);
  t.end();
});

test('test overlaps/pressed outcome decrease', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,pressed)),outcome(o1)).","precondition(overlaps(entity(e1),entity(e2),true),outcome(o1)).","result(outcome(o1),decrease(resource(r1),scalar(6)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o1",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["pressed"]},
        {"l":["e1"],"relation":"overlaps","r":["e2"]}
      ],
      "relation":"causes",
      "r":[{"l":["r1"],"relation":"decrease","r":["6"]}]
    }
  ], output);
  t.end();
});

test('test overlaps/held outcome increase_over_time', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,held)),outcome(o3)).","precondition(overlaps(entity(e1),entity(e2),true),outcome(o3)).","result(outcome(o3),increase_over_time(resource(r1),scalar(6)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o3",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["held"]},
        {"l":["e1"],"relation":"overlaps","r":["e2"]}
      ],
      "relation":"causes",
      "r":[{"l":["r1"],"relation":"increase_over_time","r":["6"]}]
    }
  ], output);
  t.end();
});

test('test not_overlaps/held outcome decrease_over_time', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,held)),outcome(o1)).","precondition(overlaps(entity(e1),entity(e2),false),outcome(o1)).","result(outcome(o1),decrease_over_time(resource(r1),scalar(1)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o1",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["held"]},
        {"l":["e1"],"relation":"not_overlaps","r":["e2"]}
      ],
      "relation":"causes",
      "r":[{"l":["r1"],"relation":"decrease_over_time","r":["1"]}]
    }
  ], output);
  t.end();
});

test('test held outcome move_towards', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,held)),outcome(o4)).",
    "result(outcome(o4),move_towards(entity(e1),cursor,scalar(3)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o4",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["held"]}
      ],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"move_towards","r":["cursor"],"num_r":["3"]}]
    }
  ], output);
  t.end();
});

test('test held outcome move_away', function (t) {
  var output = translateASP([
    "precondition(control_event(button(mouse,held)),outcome(o4)).",
    "result(outcome(o4),move_away(entity(e1),cursor,scalar(10)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o4",
      "l":[
        {"l":["mouse_button"],"relation":"control_event","r":["held"]}
      ],
      "relation":"causes",
      "r":[{"l":["e1"],"relation":"move_away","r":["cursor"],"num_r":["10"]}]
    }
  ], output);
  t.end();
});

test('test overlaps/click outcome delete/increase', function (t) {
  var output = translateASP([
    "precondition(overlaps(entity(e1),entity(e2),true),outcome(o3)).",
    "precondition(control_event(click(entity(e2))),outcome(o3)).",
    "result(outcome(o3),delete(entity(e1))).",
    "result(outcome(o3),delete(entity(e2))).",
    "result(outcome(o3),increase(resource(r1),scalar(1))).",
    "result(outcome(o3),increase(resource(r2),scalar(11)))."
  ]);
  t.deepEqual([
    {"l":["o3_e2ClickListener"],"relation":"instance_of","r":["click_listener"],"for":["e2"],"tags":["create"],"goal_keyword":"o3"},
    {
      "goal_keyword":"o3",
      "l":[
        {"l":["e1"],"relation":"overlaps","r":["e2"]},
        {"l":["o3_e2ClickListener"],"relation":"instance_of","r":["click_listener"],"for":["e2"],"tags":["create"],"goal_keyword":"o3"}
      ],
      "relation":"causes",
      "r":[
        {"l":["e1"],"relation":"action","r":["delete"]},
        {"l":["e2"],"relation":"action","r":["delete"]},
        {"l":["r1"],"relation":"increase","r":["1"]},
        {"l":["r2"],"relation":"increase","r":["11"]},
      ],
      "listener": "o3_e2ClickListener"
    }
  ], output);
  t.end();
});

test('test ge/held outcome decrease', function (t) {
  var output = translateASP([
    "precondition(ge(resource(r2),scalar(6)),outcome(o4)).",
    "precondition(control_event(button(mouse,held)),outcome(o4)).",
    "result(outcome(o4),decrease(resource(r1),scalar(1)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o4",
      "l":[
        {"l":["r2"],"relation":"ge","r":["6"]},
        {"l":["mouse_button"],"relation":"control_event","r":["held"]}
      ],
      "relation":"causes",
      "r":[{"l":["r1"],"relation":"decrease","r":["1"]}]
    }
  ], output);
  t.end();
});

test('test ge/held outcome decrease by resource', function (t) {
  var output = translateASP([
    "precondition(ge(resource(r1),scalar(0)),outcome(o1)).",
    "precondition(control_event(button(mouse,held)),outcome(o1)).",
    "result(outcome(o1),decrease(resource(r2),resource(r1)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o1",
      "l":[
        {"l":["r1"],"relation":"ge","r":["0"]},
        {"l":["mouse_button"],"relation":"control_event","r":["held"]}
      ],
      "relation":"causes",
      "r":[{"l":["r2"],"relation":"decrease","r":["r1"]}]
    }
  ], output);
  t.end();
});

test('test overlaps/le outcome delete', function (t) {
  var output = translateASP([
    "precondition(overlaps(entity(e1),entity(e2),true),outcome(o6)).","precondition(le(resource(r1),scalar(0)),outcome(o6)).","result(outcome(o6),delete(entity(e1))).","result(outcome(o6),delete(entity(e2)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o6",
      "l":[
        {"l":["e1"],"relation":"overlaps","r":["e2"]},
        {"l":["r1"],"relation":"le","r":["0"]}

      ],
      "relation":"causes",
      "r":[
        {"l":["e1"],"relation":"action","r":["delete"]},
        {"l":["e2"],"relation":"action","r":["delete"]}
      ]
    }
  ], output);
  t.end();
});

test('test le resource/held outcome increase', function (t) {
  var output = translateASP([
    "precondition(le(resource(r1),resource(r2)),outcome(o5)).",
    "precondition(control_event(button(mouse,held)),outcome(o5)).",
    "result(outcome(o5),increase(resource(r2),scalar(6)))."
  ]);
  t.deepEqual([
    {
      "goal_keyword":"o5",
      "l":[
        {"l":["r1"],"relation":"le","r":["r2"]},
        {"l":["mouse_button"],"relation":"control_event","r":["held"]}
      ],
      "relation":"causes",
      "r":[{"l":["r2"],"relation":"increase","r":["6"]}]
    }
  ], output);
  t.end();
});

test('test le/click outcome delete/increase', function (t) {
  var output = translateASP([
    "precondition(le(resource(r1),scalar(1)),outcome(o2)).",
    "precondition(control_event(click(entity(e1))),outcome(o2)).",
    "result(outcome(o2),delete(entity(e1))).",
    "result(outcome(o2),increase(resource(r2),scalar(11))).",
  ]);
  t.deepEqual([
    {"l":["o2_e1ClickListener"],"relation":"instance_of","r":["click_listener"],"for":["e1"],"tags":["create"],"goal_keyword":"o2"},
    {
      "goal_keyword":"o2",
      "l":[
        {"l":["r1"],"relation":"le","r":["1"]},
        {"l":["o2_e1ClickListener"],"relation":"instance_of","r":["click_listener"],"for":["e1"],"tags":["create"],"goal_keyword":"o2"}
      ],
      "relation":"causes",
      "r":[
        {"l":["e1"],"relation":"action","r":["delete"]},
        {"l":["r2"],"relation":"increase","r":["11"]},
      ],
      "listener": "o2_e1ClickListener"
    }
  ], output);
  t.end();
});

test('test tick outcome moves/move_towards cursor/entity and increase/decrease', function (t) {
  var output = translateASP([
    "precondition(tick,tick).",
    "result(tick,moves(entity(e1),forward,scalar(7))).",
    "result(tick,move_towards(entity(e1),cursor,scalar(3))).",
    "result(tick,move_towards(entity(e1),entity(e2),scalar(3))).",
    "result(tick,increase(resource(r2),scalar(1))).",
    "result(tick,decrease(resource(r1),scalar(6)))."
  ]);
  t.deepEqual([
    {"l":["e1"],"relation":"moves","r":["forward"],"num_r":["7"], "tags":["update"],"goal_keyword":"tick"},
    {"l":["e1"],"relation":"move_towards","r":["cursor"],"num_r":["3"], "tags":["update"],"goal_keyword":"tick"},
    {"l":["e1"],"relation":"move_towards","r":["e2"],"num_r":["3"], "tags":["update"],"goal_keyword":"tick"},
    {"l":["r2"],"relation":"increase","r":["1"],"tags":["update"],"goal_keyword":"tick"},
    {"l":["r1"],"relation":"decrease","r":["6"],"tags":["update"],"goal_keyword":"tick"}
  ], output);
  t.end();
});
