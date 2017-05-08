entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_2_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),star)).
initialize(set_color(entity(e_1_XX_),blue)).
initialize(set_color(entity(e_2_XX_),white)).

controlLogic(draggable(entity(e_2_XX_))).

timer(pingpong(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(8))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase_over_time(resource(r_1_XX_),scalar(2))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_2_XX_)).
result(outcome(o_2_XX_),add(entity(e_2_XX_),scalar(1),location(bottom,right))).

precondition(le(resource(r_1_XX_),scalar(4)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),mode_change(game_loss)).

precondition(control_event(button(mouse,held)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),decrease_over_time(resource(r_1_XX_),scalar(3))).

precondition(timer_elapsed(timer(pingpong(entity(e_1_XX_)))),outcome(pingpong_entity_e_1_XX__XX__XX_)).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),rotates(entity(e_1_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),add(entity(e_1_XX_),scalar(1),location(top,center))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(4))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(9))).

reading(bad,outcome(o_4_XX_)).
reading(bad,tick).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(top,center),entity(e_1_XX_))).
reading(produces,relation(location(bottom,right),entity(e_2_XX_))).
