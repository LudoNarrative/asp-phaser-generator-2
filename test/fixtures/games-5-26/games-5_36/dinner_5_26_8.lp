label(resource(r_1_XX_),satiation).
label(entity(e_1_XX_),food).
label(entity(e_2_XX_),friend).
label(resource(r_2_XX_),r(2)).

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
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).

timer_logic(timer(t_1_XX_),scalar(3),loop).
timer_logic(timer(t_2_XX_),scalar(4),loop).

initialize(set_value(resource(r_1_XX_),scalar(10))).
initialize(set_value(resource(r_2_XX_),scalar(2))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),mode_change(narrative_gating)).

precondition(ge(resource(r_1_XX_),scalar(8)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),move_away(entity(e_2_XX_),cursor,scalar(4))).

precondition(timer_elapsed(t_1_XX_),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase(resource(r_2_XX_),scalar(3))).

precondition(timer_elapsed(t_2_XX_),outcome(o_4_XX_)).
result(outcome(o_4_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,left))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_5_XX_)).
result(outcome(o_5_XX_),decrease(resource(r_2_XX_),scalar(4))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_6_XX_)).
result(outcome(o_6_XX_),increase(resource(r_1_XX_),scalar(1))).
result(outcome(o_6_XX_),delete(entity(e_1_XX_))).

precondition(control_event(button(mouse,held)),outcome(repeled_from_cursor_entity_e_1_XX__XX__XX_)).
precondition(le(resource(r_2_XX_),scalar(9)),outcome(repeled_from_cursor_entity_e_1_XX__XX__XX_)).
result(outcome(repeled_from_cursor_entity_e_1_XX__XX__XX_),move_away(entity(e_1_XX_),cursor,scalar(2))).

precondition(tick,tick).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_2_XX_))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,tick).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_6_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(bottom,left),entity(e_1_XX_))).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(consumes,relation(entity(e_2_XX_),entity(e_1_XX_))).
reading(hurt,relation(entity(e_2_XX_),entity(e_1_XX_))).
reading(flees,relation(entity(e_1_XX_),cursor)).
reading(flees,relation(entity(e_2_XX_),cursor)).
reading(stakes(low),resource(r_1_XX_)).
reading(stakes(low),resource(r_2_XX_)).

==========
<ul>
<li>The goal is to produce satiation</li>

<li>The player will do this by<ul>
<li>
attempting to make a [[blue|circle]] and [[red|circle]] touch
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>	the [[red|circle]] moves away from the cursor</li>
<li>	the [[blue|circle]] moves away from the cursor</li>
<li>
	clicking on a [[red|circle]]
</li>
<li>
	holding the mouse button
</li>
</ul></ul>