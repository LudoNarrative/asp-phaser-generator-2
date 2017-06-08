entity(e1).
entity(e2).

resource(r1).

initialize(add(entity(e1),scalar(1),location(top,right))).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).

initialize(set_value(resource(r1),scalar(0))).

precondition(ge(resource(r1),scalar(40)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),move_away(entity(e_1_XX_),cursor,scalar(4))).

precondition(tick,tick).
result(tick,decrease_over_time(property(entity(e1),health),scalar(1))).
