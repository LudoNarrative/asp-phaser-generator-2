entity(e1).
entity(e2).

initialize(set_color(entity(e1),red)).
initialize(set_color(entity(e2),red)).
initialize(set_draggable(entity(e1),true)).
initialize(add(entity(e1),scalar(1),location(top,right))).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).

initialize(set_sprite(entity(e2),square)).
initialize(set_color(entity(e2),blue)).

precondition(control_event(click(entity(e1))),outcome(o1)).
result(outcome(o1),add(entity(e2),scalar(1),entity(e1))).