entity(e1).
entity(e2).

resource(r1).
resource(r2).

many(e1).
many(e2).

initialize(add(entity(e1),scalar(2),location(top,right))).
initialize(add(entity(e2),scalar(10),location(top,center))).
initialize(set_sprite(entity(e1),square)).
initialize(set_sprite(entity(e2),square)).
initialize(set_value(resource(r1),scalar(11))).
initialize(set_value(resource(r2),scalar(6))).

goal(prevent(o7)).
goal(maintain(r1)).

initialize(set_draggable(entity(e1),true)).

precondition(overlaps(entity(e1),entity(e2),true),outcome(o3)).
precondition(control_event(click(entity(e2))),outcome(o3)).
result(outcome(o3),delete(entity(e1))).
result(outcome(o3),delete(entity(e2))).
result(outcome(o3),increase(resource(r1),scalar(1))).
result(outcome(o3),increase(resource(r2),scalar(11))).

precondition(ge(resource(r2),scalar(6)),outcome(o4)).
precondition(control_event(button(mouse,held)),outcome(o4)).
result(outcome(o4),decrease(resource(r1),scalar(1))).

precondition(ge(resource(r1),scalar(0)),outcome(o1)).
precondition(control_event(button(mouse,held)),outcome(o1)).
result(outcome(o1),decrease(resource(r2),resource(r1))).

precondition(le(resource(r1),scalar(6)),outcome(o7)).
result(outcome(o7),mode_change(game_loss)).

precondition(overlaps(entity(e1),entity(e2),true),outcome(o6)).
precondition(le(resource(r1),scalar(0)),outcome(o6)).
result(outcome(o6),delete(entity(e1))).
result(outcome(o6),delete(entity(e2))).

precondition(le(resource(r1),resource(r2)),outcome(o5)).
precondition(control_event(button(mouse,held)),outcome(o5)).
result(outcome(o5),increase(resource(r2),scalar(6))).

precondition(le(resource(r1),scalar(1)),outcome(o2)).
precondition(control_event(click(entity(e1))),outcome(o2)).
result(outcome(o2),delete(entity(e1))).
result(outcome(o2),increase(resource(r2),scalar(11))).

precondition(tick,tick).
result(tick,moves(entity(e1),forward,scalar(7))).
result(tick,move_towards(entity(e1),cursor,scalar(3))).
result(tick,move_towards(entity(e1),entity(e2),scalar(3))).
result(tick,increase(resource(r2),scalar(1))).
result(tick,decrease(resource(r1),scalar(6))).
