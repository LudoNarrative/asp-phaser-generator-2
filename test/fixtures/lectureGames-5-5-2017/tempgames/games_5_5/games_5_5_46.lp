entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(3),location(top,left))).
initialize(add(entity(e_1_XX_),scalar(3),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(3),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(set_color(entity(e_2_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_1_XX_),white)).

controlLogic(draggable(entity(e_1_XX_))).

timer(pingpong(entity(e_2_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(6))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase_over_time(resource(r_1_XX_),scalar(2))).

precondition(le(resource(r_1_XX_),scalar(1)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_1_XX_),true),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase_over_time(resource(r_1_XX_),scalar(3))).

precondition(timer_elapsed(timer(pingpong(entity(e_2_XX_)))),outcome(pingpong_entity_e_2_XX__XX__XX_)).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),add(entity(e_2_XX_),scalar(1),location(top,right))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(1))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,tick).
reading(bad,outcome(pingpong_entity_e_2_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(good,outcome(o_3_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(top,right),entity(e_2_XX_))).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
