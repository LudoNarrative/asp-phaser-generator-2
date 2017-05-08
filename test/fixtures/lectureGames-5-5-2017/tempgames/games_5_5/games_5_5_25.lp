entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_2_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(set_sprite(entity(e_2_XX_),square)).
initialize(set_sprite(entity(e_1_XX_),star)).
initialize(set_color(entity(e_2_XX_),yellow)).
initialize(set_color(entity(e_1_XX_),cyan)).

controlLogic(draggable(entity(e_2_XX_))).

timer(wander(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(8))).

precondition(control_event(button(mouse,pressed)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),add(entity(e_2_XX_),scalar(1),location(top,center))).

precondition(control_event(button(mouse,held)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),increase_over_time(resource(r_1_XX_),scalar(10))).

precondition(ge(resource(r_1_XX_),scalar(10)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_4_XX_)).
result(outcome(o_4_XX_),decrease_over_time(resource(r_1_XX_),scalar(7))).

precondition(timer_elapsed(timer(wander(entity(e_1_XX_)))),outcome(wander_entity_e_1_XX__XX__XX_)).
result(outcome(wander_entity_e_1_XX__XX__XX_),rotate_to(entity(e_1_XX_),random_int(scalar(0),scalar(360)))).
result(outcome(wander_entity_e_1_XX__XX__XX_),increase(resource(r_1_XX_),scalar(7))).
result(outcome(wander_entity_e_1_XX__XX__XX_),add(entity(e_1_XX_),scalar(1),location(bottom,right))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(4))).

reading(bad,resource(r_1_XX_)).
reading(bad,outcome(o_2_XX_)).
reading(bad,outcome(wander_entity_e_1_XX__XX__XX_)).
reading(good,outcome(o_4_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(produces,relation(location(bottom,right),entity(e_1_XX_))).
reading(produces,relation(location(top,center),entity(e_2_XX_))).
reading(goal(reduce),resource(r_1_XX_)).
