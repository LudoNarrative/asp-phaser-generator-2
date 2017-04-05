entity(e1).
entity(e2).

resource(r1).

many(e1).
many(e2).

initialize(set_static(entity(e2),true)).

initialize(set_draggable(entity(e1),true)).

goal(prevent(o2)).
goal(maintain(r1)).

initialize(set_sprite(entity(e1),circle)).
initialize(set_color(entity(e1),white)).
initialize(add(entity(e1),scalar(1),location(middle,center))).

initialize(set_sprite(entity(e2),circle)).
initialize(set_color(entity(e2),blue)).
initialize(add(entity(e2),scalar(1),location(middle,left))).
initialize(add(entity(e2),scalar(1),location(middle,right))).

initialize(set_value(resource(r1),scalar(11))).

timer_logic(timer(t1),scalar(5),loop).

precondition(timerElapsed(t1),outcome(t1)).
result(outcome(t1),add(entity(e1),scalar(1),location(middle,center))).

precondition(overlaps(entity(e1),entity(e2),true),outcome(o1)).
result(outcome(o1),delete(entity(e1))).
result(outcome(o1),increase(resource(r1),scalar(11))).

precondition(le(resource(r1),scalar(0)),outcome(o2)).
result(outcome(o2),mode_change(narrative_progression)).

precondition(tick,tick).
result(tick,decrease_over_time(resource(r1),scalar(1))).
