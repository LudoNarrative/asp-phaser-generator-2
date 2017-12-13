entity(e1).
entity(e2).


resource(r1).
resource(r2).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).

initialize(set_sprite(entity(e2),square)).
initialize(set_color(entity(e2),blue)).


initialize(set_draggable(entity(e1),true)).
initialize(add(entity(e1),scalar(1),location(top,right))).

precondition(control_event(button(mouse,pressed)),outcome(o1)).
result(outcome(o1),set_value(resource(r1),amount(blue))).
result(outcome(o1),set_value(resource(r2),resource(r1))).
result(outcome(o1),set_value(resource(r1),scalar(237)).
result(outcome(o1),set_value(resource(r1),random_int(2,9)).