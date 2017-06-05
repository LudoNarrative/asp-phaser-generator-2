entity(e1).
entity(e2).


initialize(set_sprite(entity(e1),circle)).
initialize(set_sprite(entity(e2),circle)).
initialize(set_color(entity(e2),red)).
initialize(set_color(entity(e1),green)).
resource(r1).
resource(r2).

initialize(set_value(resource(r1),scalar(10))).
initialize(set_value(resource(r2),scalar(5))).

precondition(ge(resource(r1),resource(r2)),outcome(should_happen)).
result(outcome(should_happen),add(entity(e1),scalar(1),location(bottom,left))).

precondition(le(resource(r1),resource(r2)),outcome(shouldnt_happen)).
result(outcome(shouldnt_happen),add(entity(e2),scalar(1),location(bottom,right))).
