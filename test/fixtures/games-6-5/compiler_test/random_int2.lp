entity(e1).


initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).
resource(r1).

initialize(add(entity(e1),scalar(1),location(top,right))).
initialize(set_value(resource(r1),scalar(5))).

precondition(ge(resource(r1),random_int(0,10),outcome(should_happen)).
result(outcome(should_happen),add(entity(e1),scalar(1),location(bottom,left))).
