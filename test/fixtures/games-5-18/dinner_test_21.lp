label(resource(r_1_XX_),satiation).
label(entity(e_1_XX_),food).
label(entity(e_2_XX_),friend).

entity(e_1_XX_).
entity(e_2_XX_).

resource(r_1_XX_).

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).

initialize(add(entity(e_1_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,right))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,right))).
initialize(set_static(entity(e_2_XX_),true)).
initialize(set_color(entity(e_2_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_1_XX_),blue)).

initialize(set_value(resource(r_1_XX_),scalar(9))).

precondition(control_event(button(mouse,held)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),move_away(entity(e_1_XX_),cursor,scalar(4))).

precondition(control_event(button(mouse,pressed)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,left))).

precondition(ge(resource(r_1_XX_),scalar(10)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),move_towards(entity(e_1_XX_),entity(e_1_XX_),scalar(4))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_4_XX_)).
result(outcome(o_4_XX_),increase(resource(r_1_XX_),scalar(2))).
result(outcome(o_4_XX_),delete(entity(e_1_XX_))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_5_XX_)).
result(outcome(o_5_XX_),mode_change(narrative_gating)).

precondition(tick,tick).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,tick).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_4_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(bottom,left),entity(e_1_XX_))).
reading(consumes,relation(entity(e_2_XX_),entity(e_1_XX_))).

==========
<ul>
<li>The goal is to produce satiation</li>

<li>They will do this by<ul>
<li>
attempting to make a [[red|circle]] and [[blue|circle]] touch
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>	the [[blue|circle]] moves away from the cursor</li>
<li>
	pressing the mouse button
</li>
<li>
	holding the mouse button
</li>
</ul></ul>