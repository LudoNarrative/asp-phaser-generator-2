entity(e1).
entity(e2).
entity(e3).

resource(r1).

many(e1).
many(e2).
many(e3).

goal(prevent(o2)).
goal(maintain(r1)).

timer_logic(timer(t1),scalar(2),loop).

initialize(set_static(entity(e3),true)).

initialize(set_sprite(entity(e1),square)).
initialize(set_sprite(entity(e2),triangle)).
initialize(set_sprite(entity(e3),square)).
initialize(set_color(entity(e1),red)).
initialize(set_color(entity(e2),blue)).
initialize(set_value(resource(r1),scalar(11))).

initialize(add(entity(e1),scalar(2),location(top,right))).
initialize(add(entity(e1),scalar(2),location(bottom,right))).
initialize(add(entity(e2),scalar(2),location(top,left))).
initialize(add(entity(e2),scalar(2),location(bottom,left))).
initialize(add(entity(e3),scalar(10),location(top,center))).
initialize(add(entity(e3),scalar(10),location(bottom,center))).

precondition(control_event(button(mouse,held)),outcome(joeyjoejoeshabadoojunior_o_3____aasdfasdf___)).

result(outcome(joeyjoejoeshabadoojunior_o_3____aasdfasdf___),increase_over_time(resource(r1),scalar(6))).
result(outcome(joeyjoejoeshabadoojunior_o_3____aasdfasdf___),rotates(entity(e2),cw,scalar(10))).

precondition(timer_elapsed(t1),outcome(t1)).
result(outcome(t1),set_value(resource(r1),scalar(11))).

result(outcome(t1),rotates(entity(e2),cw,scalar(10))).

precondition(tick,tick).
result(tick,moves(entity(e2),forward,random_int(10,20))).
result(tick,decrease_over_time(resource(r1),scalar(1))).

precondition(control_event(button(mouse,held)),outcome(o1)).
precondition(overlaps(entity(e1),entity(e2),false),outcome(o1)).
result(outcome(o1),decrease_over_time(resource(r1),scalar(1))).

precondition(control_event(button(mouse,held)),outcome(o4)).
result(outcome(o4),move_towards(entity(e1),cursor,scalar(3))).

precondition(le(resource(r1),scalar(0)),outcome(o2)).
result(outcome(o2),mode_change(game_loss)).

result(tick,apply_restitution(entity(e1),entity(e3))).
result(tick,apply_restitution(entity(e3),entity(e2))).