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
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(set_static(entity(e_2_XX_),true)).
initialize(set_draggable(entity(e_1_XX_),true)).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).

controlLogic(draggable(entity(e_1_XX_))).

timer_logic(timer(t_1_XX_),scalar(2),loop).

initialize(set_value(resource(r_1_XX_),scalar(10))).
initialize(set_value(resource(r_2_XX_),scalar(5))).

precondition(control_event(button(mouse,held)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),decrease_over_time(resource(r_2_XX_),scalar(6))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_2_XX_)).
result(outcome(o_2_XX_),increase(resource(r_1_XX_),scalar(3))).
result(outcome(o_2_XX_),increase(resource(r_2_XX_),scalar(1))).
result(outcome(o_2_XX_),delete(entity(e_1_XX_))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),mode_change(narrative_gating)).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_4_XX_)).
precondition(le(resource(r_2_XX_),scalar(2)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),increase(resource(r_2_XX_),scalar(3))).

precondition(control_event(click(entity(e_2_XX_))),outcome(o_5_XX_)).
precondition(le(resource(r_2_XX_),scalar(10)),outcome(o_5_XX_)).
result(outcome(o_5_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,right))).

precondition(control_event(click(entity(e_2_XX_))),outcome(o_6_XX_)).
result(outcome(o_6_XX_),decrease(resource(r_2_XX_),scalar(8))).

precondition(timer_elapsed(t_1_XX_),outcome(o_7_XX_)).
result(outcome(o_7_XX_),add(entity(e_1_XX_),scalar(1),location(middle,center))).

precondition(tick,tick).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_1_XX_))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(3))).
result(tick,increase_over_time(resource(r_2_XX_),scalar(2))).

reading(bad,tick).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_2_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(entity(e_1_XX_),resource(r_2_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_2_XX_))).
reading(consumes,relation(entity(e_2_XX_),entity(e_1_XX_))).

==========
<ul>
<li>The goal is to produce satiation</li>

<li>They will do this by<ul>
<li>
attempting to make a [[blue|circle]] and [[red|circle]] touch
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking-and-dragging [[red|circle]]s
</li>
<li>
	clicking on a [[red|circle]]
</li>
<li>
	clicking on a [[blue|circle]]
</li>
<li>
	holding the mouse button
</li>
</ul></ul>
