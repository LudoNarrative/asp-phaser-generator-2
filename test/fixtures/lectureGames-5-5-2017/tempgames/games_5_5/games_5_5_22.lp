entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(3),location(top,left))).
initialize(add(entity(e_1_XX_),scalar(3),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(3),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(3),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(2),location(top,right))).
initialize(add(entity(e_2_XX_),scalar(2),location(middle,right))).
initialize(add(entity(e_2_XX_),scalar(2),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(2),location(bottom,center))).
initialize(set_sprite(entity(e_1_XX_),pentagon)).
initialize(set_sprite(entity(e_2_XX_),star)).
initialize(set_color(entity(e_2_XX_),green)).
initialize(set_color(entity(e_1_XX_),white)).

controlLogic(draggable(entity(e_1_XX_))).

timer(pingpong(entity(e_2_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(9))).

precondition(le(resource(r_1_XX_),scalar(1)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),mode_change(game_loss)).

precondition(control_event(button(mouse,held)),outcome(o_2_XX_)).
precondition(le(resource(r_1_XX_),scalar(8)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),move_away(entity(e_1_XX_),entity(e_2_XX_),scalar(1))).
result(outcome(o_2_XX_),move_away(entity(e_1_XX_),cursor,scalar(1))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase_over_time(resource(r_1_XX_),scalar(2))).

precondition(timer_elapsed(timer(pingpong(entity(e_2_XX_)))),outcome(pingpong_entity_e_2_XX__XX__XX_)).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_2_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(2))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(4))).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).

reading(bad,outcome(pingpong_entity_e_2_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_3_XX_)).
reading(good,entity(e_2_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_1_XX_))).
