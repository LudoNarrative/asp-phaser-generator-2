label(entity(e_1_XX_),e1).
label(resource(r_1_XX_),stress).
label(entity(e_2_XX_),e(2)).
label(entity(e_3_XX_),e(3)).
label(resource(r_2_XX_),r(2)).

entity(e_1_XX_).
entity(e_2_XX_).
entity(e_3_XX_).

resource(r_1_XX_).
resource(r_2_XX_).

many(entity(e_1_XX_)).
many(entity(e_2_XX_)).
many(entity(e_3_XX_)).

initialize(set_static(entity(e_1_XX_),true)).
initialize(set_static(entity(e_3_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,left))).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,right))).
initialize(add(entity(e_1_XX_),scalar(1),location(bottom,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_3_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_3_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_3_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_3_XX_),scalar(1),location(bottom,right))).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_sprite(entity(e_3_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).
initialize(set_color(entity(e_3_XX_),green)).

initialize(set_value(resource(r_1_XX_),scalar(2))).
initialize(set_value(resource(r_2_XX_),scalar(1))).

precondition(control_event(click(entity(e_3_XX_))),outcome(o_1_XX_)).
precondition(overlaps(entity(e_2_XX_),entity(e_2_XX_),false),outcome(o_1_XX_)).
precondition(ge(resource(r_2_XX_),scalar(10)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),add(entity(e_1_XX_),scalar(1),location(top,left))).

precondition(ge(resource(r_2_XX_),scalar(4)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),move_towards(entity(e_2_XX_),entity(e_2_XX_),scalar(4))).

precondition(control_event(click(entity(e_2_XX_))),outcome(o_3_XX_)).
result(outcome(o_3_XX_),increase(resource(r_2_XX_),scalar(1))).
result(outcome(o_3_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,center))).

precondition(ge(resource(r_1_XX_),scalar(4)),outcome(o_4_XX_)).
result(outcome(o_4_XX_),mode_change(game_loss)).

precondition(control_event(click(entity(e_2_XX_))),outcome(o_5_XX_)).
precondition(ge(resource(r_1_XX_),scalar(3)),outcome(o_5_XX_)).
result(outcome(o_5_XX_),decrease(resource(r_1_XX_),scalar(9))).
result(outcome(o_5_XX_),add(entity(e_1_XX_),scalar(1),location(bottom,left))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_6_XX_)).
precondition(overlaps(entity(e_2_XX_),entity(e_2_XX_),false),outcome(o_6_XX_)).
result(outcome(o_6_XX_),delete(entity(e_1_XX_))).

precondition(tick,tick).
result(tick,move_away(entity(e_2_XX_),entity(e_3_XX_),scalar(4))).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_2_XX_))).
result(tick,increase_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,resource(r_1_XX_)).
reading(bad,tick).
reading(good,outcome(o_5_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(produces,relation(location(top,left),entity(e_1_XX_))).
reading(produces,relation(location(bottom,left),entity(e_1_XX_))).
reading(produces,relation(location(bottom,center),entity(e_1_XX_))).
reading(goal(reduce),resource(r_1_XX_)).
reading(chases,relation(entity(e_2_XX_),entity(e_2_XX_))).
reading(flees,relation(entity(e_2_XX_),entity(e_3_XX_))).
reading(costs,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(stakes(low),resource(r_1_XX_)).
reading(stakes(low),resource(r_2_XX_)).
reading(grinding,resource(r_2_XX_)).

==========
<ul>
<li>The goal is to reduce stress</li>

<li>The player will do this by<ul>
<li>
	clicking on a [[blue|circle]]
	 at the same time as
compare(ge,resource(r(1)))
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking on a [[red|circle]]
</li>
<li>
	clicking on a [[blue|circle]]
</li>
<li>
	clicking on a [[green|circle]]
</li>
</ul></ul>