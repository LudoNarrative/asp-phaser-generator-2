label(resource(r_1_XX_),composure).
label(resource(r_2_XX_),tension).
label(entity(e_1_XX_),yourself).
label(entity(e_2_XX_),help).
label(entity(e_3_XX_),harm).

entity(e_1_XX_).
entity(e_2_XX_).
entity(e_3_XX_).

resource(r_1_XX_).
resource(r_2_XX_).

singular(entity(e_1_XX_)).

many(entity(e_2_XX_)).
many(entity(e_3_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(add(entity(e_3_XX_),scalar(1),location(top,left))).
initialize(add(entity(e_3_XX_),scalar(1),location(top,right))).
initialize(add(entity(e_3_XX_),scalar(1),location(bottom,center))).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_sprite(entity(e_3_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).
initialize(set_color(entity(e_3_XX_),green)).

controlLogic(draggable(entity(e_1_XX_))).

initialize(set_value(resource(r_1_XX_),scalar(7))).
initialize(set_value(resource(r_2_XX_),scalar(0))).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),false),outcome(o_1_XX_)).
result(outcome(o_1_XX_),increase_over_time(property(entity(e_1_XX_),health),scalar(7))).
result(outcome(o_1_XX_),increase_over_time(resource(r_1_XX_),scalar(1))).

precondition(overlaps(entity(e_1_XX_),entity(e_3_XX_),true),outcome(o_2_XX_)).
result(outcome(o_2_XX_),increase(resource(r_1_XX_),scalar(1))).
result(outcome(o_2_XX_),add(entity(e_3_XX_),scalar(1),location(top,right))).
result(outcome(o_2_XX_),delete(entity(e_3_XX_))).

precondition(le(resource(r_1_XX_),scalar(4)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),mode_change(narrative_gating)).

precondition(tick,tick).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_2_XX_))).
result(tick,apply_restitution(entity(e_1_XX_),entity(e_1_XX_))).
result(tick,apply_restitution(entity(e_3_XX_),entity(e_3_XX_))).
result(tick,moves(entity(e_2_XX_),forward,scalar(2))).
result(tick,moves(entity(e_3_XX_),forward,scalar(2))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(1))).
result(tick,look_at(entity(e_3_XX_),entity(e_1_XX_),furthest)).
result(tick,look_at(entity(e_2_XX_),entity(e_1_XX_),furthest)).

reading(goal(produce),resource(r_1_XX_)).
reading(good,resource(r_1_XX_)).
reading(good,property(entity(e_1_XX_),health)).
reading(bad,tick).
reading(good,outcome(o_2_XX_)).
reading(good,outcome(o_1_XX_)).
reading(maintenance,resource(r_1_XX_)).
reading(hurt,relation(entity(e_3_XX_),player)).
reading(hurt,relation(entity(e_1_XX_),entity(e_3_XX_))).
reading(defend_against,entity(e_3_XX_)).
reading(survive,entity(e_3_XX_)).
reading(help,relation(entity(e_2_XX_),player)).
reading(help,relation(entity(e_3_XX_),player)).
reading(hand_eye_coordination,game).
reading(stakes(low),resource(r_2_XX_)).
==========
<ul>
<li>The goal is to produce composure</li>

<li>The player will do this by<ul>
<li>
attempting to make a [[green|circle]] and [[red|circle]] touch
</li>
<li>
	attempting to keep a [[blue|circle]] and [[red|circle]] from touching
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking-and-dragging [[red|circle]]s
</li>
</ul></ul>
