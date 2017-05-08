entity(e_1_XX_)
entity(e_2_XX_)

resource(r_1_XX_)

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_2_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_sprite(entity(e_1_XX_),square)).
initialize(set_sprite(entity(e_2_XX_),square)).
initialize(set_color(entity(e_2_XX_),green)).
initialize(set_color(entity(e_1_XX_),white)).

controlLogic(draggable(entity(e_2_XX_))).

timer(t_1_XX_)
timer(t_2_XX_)
timer(patrol(entity(e_1_XX_)))

initialize(set_value(resource(r_1_XX_),scalar(3))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_1_XX_)).
result(outcome(o_1_XX_),decrease_over_time(resource(r_1_XX_),scalar(4))).

precondition(timer_elapsed(timer(t_2_XX_)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),add(entity(e_2_XX_),scalar(1),location(middle,right))).

precondition(timer_elapsed(timer(t_1_XX_)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),add(entity(e_1_XX_),scalar(1),location(middle,center))).

precondition(ge(resource(r_1_XX_),scalar(10)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),mode_change(game_loss)).

precondition(timer_elapsed(timer(patrol(entity(e_1_XX_)))),outcome(patrol_entity_e_1_XX__XX__XX_)).
result(outcome(patrol_entity_e_1_XX__XX__XX_),rotates(entity(e_1_XX_),ccw,scalar(60))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(2))).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).
result(tick,increase_over_time(resource(r_1_XX_),scalar(2))).

reading(bad,resource(r_1_XX_)).
reading(bad,tick).
reading(good,outcome(o_1_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(produces,relation(location(middle,center),entity(e_1_XX_))).
reading(produces,relation(location(middle,right),entity(e_2_XX_))).
reading(goal(reduce),resource(r_1_XX_)).
