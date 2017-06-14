entity(e1).
entity(e2).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).

initialize(set_sprite(entity(e2),square)).
initialize(set_color(entity(e2),blue)).


initialize(set_draggable(entity(e1),true)).
initialize(add(entity(e1),scalar(1),location(top,right))).

precondition(control_event(button(mouse,pressed)),outcome(o1)).
result(outcome(o1),add(entity(e2),scalar(1),cursor)).