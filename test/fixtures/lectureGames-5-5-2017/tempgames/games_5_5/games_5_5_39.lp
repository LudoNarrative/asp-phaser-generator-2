entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_sprite(entity(e_1_XX_),square)).
initialize(set_sprite(entity(e_2_XX_),pentagon)).
initialize(set_color(entity(e_1_XX_),white)).
initialize(set_color(entity(e_2_XX_),gray)).

controlLogic(draggable(entity(e_1_XX_))).

timer(t_1_XX_)
timer(patrol(entity(e_2_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(10))).

precondition(control_event(button(mouse,pressed)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,center))).

precondition(le(resource(r_1_XX_),scalar(1)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(timer_elapsed(timer(t_1_XX_)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),add(entity(e_2_XX_),scalar(1),location(bottom,right))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_4_XX_)).
result(outcome(o_4_XX_),increase_over_time(resource(r_1_XX_),scalar(6))).

precondition(timer_elapsed(timer(patrol(entity(e_2_XX_)))),outcome(patrol_entity_e_2_XX__XX__XX_)).
result(outcome(patrol_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),ccw,scalar(20))).
result(outcome(patrol_entity_e_2_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).
result(outcome(patrol_entity_e_2_XX__XX__XX_),add(entity(e_1_XX_),scalar(1),location(middle,center))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(2))).

reading(bad,outcome(patrol_entity_e_2_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_4_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(bottom,center),entity(e_1_XX_))).
reading(produces,relation(location(bottom,right),entity(e_2_XX_))).
