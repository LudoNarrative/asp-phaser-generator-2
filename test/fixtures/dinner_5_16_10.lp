
label(resource(r_1_XX_),satiation).
label(entity(e_1_XX_),food).
label(entity(e_2_XX_),friend).

entity(e_1_XX_).
entity(e_2_XX_).

resource(r_1_XX_).
resource(r_2_XX_).

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_static(entity(e_2_XX_),true)).
initialize(set_draggable(entity(e_1_XX_),true)).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).

controlLogic(draggable(entity(e_1_XX_))).

timer_logic(timer(t_1_XX_),scalar(1),loop).

initialize(set_value(resource(r_1_XX_),scalar(10))).
initialize(set_value(resource(r_2_XX_),scalar(5))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_1_XX_)).
precondition(ge(resource(r_2_XX_),scalar(0)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),decrease(resource(r_2_XX_),scalar(9))).
result(outcome(o_1_XX_),increase(resource(r_1_XX_),scalar(8))).
result(outcome(o_1_XX_),delete(entity(e_1_XX_))).

precondition(timer_elapsed(t_1_XX_),outcome(o_2_XX_)).
result(outcome(o_2_XX_),decrease(resource(r_1_XX_),scalar(3))).
result(outcome(o_2_XX_),increase(resource(r_2_XX_),scalar(2))).
result(outcome(o_2_XX_),add(entity(e_2_XX_),scalar(1),location(top,left))).

precondition(control_event(button(mouse,pressed)),outcome(o_3_XX_)).
precondition(ge(resource(r_2_XX_),scalar(4)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase(resource(r_1_XX_),scalar(3))).
result(outcome(o_3_XX_),add(entity(e_2_XX_),scalar(1),location(top,center))).

precondition(le(resource(r_1_XX_),scalar(1)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),mode_change(narrative_gating)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_5_XX_)).
result(outcome(o_5_XX_),delete(entity(e_2_XX_))).
result(outcome(o_5_XX_),add(entity(e_1_XX_),scalar(1),location(middle,center))).

precondition(tick,tick).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_1_XX_))).

reading(bad,outcome(o_1_XX_)).
reading(bad,outcome(o_2_XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_1_XX_)).
reading(good,outcome(o_3_XX_)).
reading(good,outcome(o_5_XX_)).
reading(good,entity(e_1_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(tradeoff,outcome(o_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(middle,center),entity(e_1_XX_))).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(consumes,relation(entity(e_2_XX_),entity(e_1_XX_))).
reading(consumes,relation(entity(e_2_XX_),resource(r_2_XX_))).

==========
<ul>
<li>The goal is to produce satiation</li>

<li>They will do this by<ul>
<li>
	 pressing the mouse button
	 at the same time as
compare(ge,resource(r(2)))
</li>
<li>
attempting to make a [[blue|circle]] and [[red|circle]] touch
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking-and-dragging [[red|circle]]s
</li>
<li>
	pressing the mouse button
</li>
</ul></ul>