entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_2_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(5),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(5),location(middle,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_sprite(entity(e_2_XX_),triangle)).
initialize(set_sprite(entity(e_1_XX_),pentagon)).
initialize(set_color(entity(e_1_XX_),green)).
initialize(set_color(entity(e_2_XX_),white)).

controlLogic(draggable(entity(e_2_XX_))).

timer(t_1_XX_)
timer(wander(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(10))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_1_XX_)).
precondition(le(resource(r_1_XX_),scalar(10)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase(resource(r_1_XX_),scalar(1))).
result(outcome(o_1_XX_),delete(entity(e_2_XX_))).

precondition(le(resource(r_1_XX_),scalar(2)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(timer_elapsed(timer(t_1_XX_)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),decrease(resource(r_1_XX_),scalar(1))).
result(outcome(o_3_XX_),add(entity(e_2_XX_),scalar(1),location(bottom,left))).

precondition(timer_elapsed(timer(wander(entity(e_1_XX_)))),outcome(wander_entity_e_1_XX__XX__XX_)).
result(outcome(wander_entity_e_1_XX__XX__XX_),rotate_to(entity(e_1_XX_),random_int(scalar(0),scalar(360)))).
result(outcome(wander_entity_e_1_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(1))).

reading(bad,outcome(o_3_XX_)).
reading(bad,outcome(wander_entity_e_1_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(bottom,left),entity(e_2_XX_))).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_1_XX_))).
