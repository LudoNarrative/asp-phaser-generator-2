entity(e_1_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).

initialize(add(entity(e_1_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,right))).
initialize(set_sprite(entity(e_1_XX_),square)).
initialize(set_color(entity(e_1_XX_),green)).

timer(t_1_XX_)
timer(pingpong(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(10))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),mode_change(game_loss)).

precondition(timer_elapsed(timer(t_1_XX_)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),add(entity(e_1_XX_),scalar(1),location(middle,left))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_3_XX_)).
precondition(le(resource(r_1_XX_),scalar(10)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase(resource(r_1_XX_),scalar(1))).

precondition(timer_elapsed(timer(pingpong(entity(e_1_XX_)))),outcome(pingpong_entity_e_1_XX__XX__XX_)).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),rotates(entity(e_1_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(1))).

reading(bad,outcome(pingpong_entity_e_1_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_3_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(middle,left),entity(e_1_XX_))).
