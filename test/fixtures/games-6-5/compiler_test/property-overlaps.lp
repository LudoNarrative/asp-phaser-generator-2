entity(e1).
entity(e2).

initialize(add(entity(e1),scalar(1),location(top,right))).
initialize(add(entity(e2),scalar(1),location(bottom,right))).
initialize(set_draggable(entity(e1),true)).

initialize(set_sprite(entity(e1),triangle)).
initialize(set_color(entity(e1),green)).

initialize(set_sprite(entity(e2),triangle)).
initialize(set_color(entity(e2),red)).

precondition(overlaps(entity(e1),entity(e2),true),outcome(o1)).
result(outcome(o1),decrease(property(entity(e1),health),scalar(10))).

