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
initialize(set_draggable(entity(e1),true)).
initialize(set_draggable(entity(e2),true)).

precondition(tick,tick).
result(tick,moves(entity(e1),west,resource(r1))).
result(tick,increase_over_time(resource(r1),scalar(1))).
result(tick,look_at(entity(e1),entity(e2),random)).