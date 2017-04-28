entity(e1).
entity(e2).

resource(r1).

singular(e1).
many(e2).

goal(prevent(o2)).
goal(maintain(r1)).

initialize(set_sprite(entity(e1),square)).
initialize(set_color(entity(e1),green)).
initialize(add(entity(e1),scalar(1),location(middle,center))).
initialize(rotate_to(entity(e1),random_int(0,360))).

initialize(set_sprite(entity(e2),square)).
initialize(set_color(entity(e2),blue)).
initialize(add(entity(e2),scalar(1),location(top,left))).
initialize(add(entity(e2),scalar(1),location(top,right))).
initialize(add(entity(e2),scalar(1),location(bottom,left))).
initialize(add(entity(e2),scalar(1),location(bottom,right))).
initialize(rotate_to(entity(e2),random_int(0,360))).

initialize(set_value(resource(r1),scalar(11))).

timer_logic(timer(t1),scalar(10),loop).
timer_logic(timer(t2),scalar(5),loop).

precondition(control_event(button(mouse,pressed)),outcome(o3)).
precondition(overlaps(entity(e1),entity(e2),false),outcome(o3)).
result(outcome(o3),increase(resource(r1),scalar(11))).

precondition(timerElapsed(t2),outcome(t2)).
result(outcome(t2),rotate_to(entity(e2),random_int(0,360))).

precondition(le(resource(r1),scalar(0)),outcome(o2)).
result(outcome(o2),mode_change(game_loss)).

precondition(tick,tick).
result(tick,moves(entity(e1),forward,scalar(7))).
result(tick,moves(entity(e2),forward,scalar(7))).
result(tick,decrease_over_time(resource(r1),scalar(1))).

precondition(control_event(button(mouse,pressed)),outcome(o1)).
precondition(overlaps(entity(e1),entity(e2),true),outcome(o1)).
result(outcome(o1),decrease(resource(r1),scalar(6))).

precondition(timerElapsed(t1),outcome(t1)).
result(outcome(t1),rotate_to(entity(e1),random_int(0,360))).
