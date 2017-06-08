entity(e1).
entity(e2).
resource(r1).

initialize(add(entity(e1),scalar(1),location(top,right))).
initialize(add(entity(e2),scalar(1),location(bottom,right))).

initialize(set_sprite(entity(e1),circle)).
initialize(set_sprite(entity(e2),circle)).
initialize(set_color(entity(e2),red)).
initialize(set_color(entity(e1),green)).

initialize(set_value(resource(r1),scalar(0))).
controlLogic(draggable(entity(e2))).

precondition(ge(resource(r1),scalar(40)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),move_away(entity(e_1_XX_),cursor,scalar(4))).

precondition(tick,tick).
result(tick,move_towards(entity(e1),entity(e2),resource(r1))).
result(tick,increase_over_time(resource(r1),scalar(1))).

