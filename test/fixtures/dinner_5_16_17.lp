
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
initialize(set_static(entity(e_2_XX_),true)).
initialize(set_color(entity(e_2_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_1_XX_),blue)).

timer_logic(timer(t_1_XX_),scalar(4),loop).
timer_logic(timer(pingpong_entity_e_1_XX_),scalar(1),loop).

initialize(set_value(resource(r_1_XX_),scalar(9))).
initialize(set_value(resource(r_2_XX_),scalar(4))).

precondition(overlaps(entity(e_1_XX_),entity(e_1_XX_),true),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase_over_time(resource(r_2_XX_),scalar(2))).

precondition(timer_elapsed(t_1_XX_),outcome(o_2_XX_)).
result(outcome(o_2_XX_),add(entity(e_1_XX_),scalar(1),location(top,center))).

precondition(le(resource(r_2_XX_),scalar(4)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),move_towards(entity(e_1_XX_),entity(e_1_XX_),scalar(2))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_4_XX_)).
result(outcome(o_4_XX_),increase(resource(r_1_XX_),scalar(1))).
result(outcome(o_4_XX_),delete(entity(e_1_XX_))).

precondition(ge(resource(r_2_XX_),scalar(7)),outcome(o_5_XX_)).
result(outcome(o_5_XX_),move_away(entity(e_1_XX_),cursor,scalar(2))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_6_XX_)).
result(outcome(o_6_XX_),decrease(resource(r_2_XX_),scalar(3))).

precondition(le(resource(r_1_XX_),scalar(1)),outcome(o_7_XX_)).
result(outcome(o_7_XX_),mode_change(narrative_gating)).

precondition(timer_elapsed(pingpong_entity_e_1_XX_),outcome(pingpong_entity_e_1_XX__XX__XX_)).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),rotates(entity(e_1_XX_),cw,scalar(180))).
result(outcome(pingpong_entity_e_1_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).

precondition(tick,tick).
result(tick,moves(entity(e_1_XX_),forward,scalar(2))).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).

reading(bad,outcome(pingpong_entity_e_1_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_4_XX_)).
reading(sharing,relation(entity(e_1_XX_),entity(e_2_XX_))).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(entity(e_1_XX_),resource(r_2_XX_))).
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
	clicking on a [[blue|circle]]
</li>
</ul></ul>