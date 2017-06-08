entity(e1).

initialize(add(entity(e1),scalar(1),location(top,right))).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).

precondition(control_event(click(entity(e1))),outcome(o1)).
result(outcome(o1),decrease(property(entity(e1),health),scalar(10))).