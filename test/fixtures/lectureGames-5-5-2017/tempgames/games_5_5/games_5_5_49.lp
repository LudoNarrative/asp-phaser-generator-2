entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_2_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(set_sprite(entity(e_2_XX_),triangle)).
initialize(set_sprite(entity(e_1_XX_),star)).
initialize(set_color(entity(e_2_XX_),white)).
initialize(set_color(entity(e_1_XX_),black)).

controlLogic(draggable(entity(e_2_XX_))).

timer(t_1_XX_)
timer(t_2_XX_)
timer(patrol(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(10))).

precondition(timer_elapsed(timer(t_1_XX_)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),add(entity(e_1_XX_),scalar(1),location(top,left))).

precondition(le(resource(r_1_XX_),scalar(2)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase_over_time(resource(r_1_XX_),scalar(2))).

precondition(timer_elapsed(timer(t_2_XX_)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),decrease(resource(r_1_XX_),scalar(2))).

precondition(timer_elapsed(timer(patrol(entity(e_1_XX_)))),outcome(patrol_entity_e_1_XX__XX__XX_)).
result(outcome(patrol_entity_e_1_XX__XX__XX_),rotates(entity(e_1_XX_),ccw,scalar(20))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(4))).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_2_XX_))).

reading(bad,outcome(o_4_XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(good,outcome(o_3_XX_)).
reading(good,entity(e_1_XX_)).
reading(good,entity(e_2_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_1_XX_))).
