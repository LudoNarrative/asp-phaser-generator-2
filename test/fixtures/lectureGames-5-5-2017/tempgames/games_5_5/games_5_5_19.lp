entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(set_sprite(entity(e_2_XX_),square)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_color(entity(e_1_XX_),blue)).
initialize(set_color(entity(e_2_XX_),white)).

controlLogic(draggable(entity(e_1_XX_))).

timer(pingpong(entity(e_2_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(1))).

precondition(ge(resource(r_1_XX_),scalar(10)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_2_XX_)).
result(outcome(o_2_XX_),decrease(resource(r_1_XX_),scalar(2))).
result(outcome(o_2_XX_),delete(entity(e_2_XX_))).
result(outcome(o_2_XX_),add(entity(e_1_XX_),scalar(1),location(middle,right))).

precondition(timer_elapsed(timer(pingpong(entity(e_2_XX_)))),outcome(pingpong_entity_e_2_XX__XX__XX_)).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),add(entity(e_2_XX_),scalar(1),location(bottom,left))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(2))).
result(tick,increase_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,resource(r_1_XX_)).
reading(bad,tick).
reading(good,outcome(o_2_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(produces,relation(location(middle,right),entity(e_1_XX_))).
reading(produces,relation(location(bottom,left),entity(e_2_XX_))).
reading(goal(reduce),resource(r_1_XX_)).
