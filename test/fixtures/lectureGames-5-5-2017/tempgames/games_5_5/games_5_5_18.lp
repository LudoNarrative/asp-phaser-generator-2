entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_sprite(entity(e_1_XX_),triangle)).
initialize(set_color(entity(e_2_XX_),yellow)).
initialize(set_color(entity(e_1_XX_),gray)).

controlLogic(draggable(entity(e_1_XX_))).

timer(pingpong(entity(e_2_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(3))).

precondition(overlaps(entity(e_1_XX_),entity(e_1_XX_),true),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase_over_time(resource(r_1_XX_),scalar(1))).

precondition(ge(resource(r_1_XX_),scalar(8)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_3_XX_)).
result(outcome(o_3_XX_),decrease_over_time(resource(r_1_XX_),scalar(2))).

precondition(timer_elapsed(timer(pingpong(entity(e_2_XX_)))),outcome(pingpong_entity_e_2_XX__XX__XX_)).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),add(entity(e_2_XX_),scalar(1),location(bottom,center))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(1))).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_2_XX_))).
result(tick,increase_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,outcome(o_1_XX_)).
reading(bad,resource(r_1_XX_)).
reading(bad,tick).
reading(good,outcome(o_3_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(produces,relation(location(bottom,center),entity(e_2_XX_))).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(goal(reduce),resource(r_1_XX_)).
