entity(e1).
entity(e2).

initialize(add(entity(e1),scalar(1),location(top,right))).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),green)).


precondition(tick,tick).
result(tick,decrease_over_time(property(entity(e1),health),scalar(1))).
