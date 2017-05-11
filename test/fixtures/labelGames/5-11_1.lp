label(resource(r_1_XX_),satiation).
label(entity(e_1_XX_),food).
label(entity(e_2_XX_),friend).

entity(e_1_XX_).
entity(e_2_XX_).

resource(r_1_XX_).
resource(r_2_XX_).

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(add(entity(e_1_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(set_draggable(entity(e_1_XX_),true)).
initialize(set_draggable(entity(e_2_XX_),true)).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).

controlLogic(draggable(entity(e_1_XX_))).
controlLogic(draggable(entity(e_2_XX_))).

initialize(set_value(resource(r_1_XX_),scalar(10))).
initialize(set_value(resource(r_2_XX_),scalar(10))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase(resource(r_1_XX_),scalar(8))).
result(outcome(o_1_XX_),increase(resource(r_2_XX_),scalar(3))).
result(outcome(o_1_XX_),delete(entity(e_1_XX_))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(narrative_gating)).

precondition(control_event(button(mouse,held)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),decrease_over_time(resource(r_1_XX_),scalar(1))).
result(outcome(o_3_XX_),decrease_over_time(resource(r_2_XX_),scalar(4))).

precondition(control_event(button(mouse,pressed)),outcome(o_4_XX_)).
precondition(le(resource(r_2_XX_),scalar(10)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,right))).

precondition(tick,tick).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(2))).

reading(bad,tick).
reading(bad,outcome(o_3_XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(bottom,right),entity(e_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_2_XX_))).
reading(consumes,relation(entity(e_2_XX_),entity(e_1_XX_))).