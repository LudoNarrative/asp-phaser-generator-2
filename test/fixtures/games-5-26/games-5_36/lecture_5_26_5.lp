label(entity(e_1_XX_),e1).
label(resource(r_1_XX_),concentration).
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

timer_logic(timer(patrol_entity_e_2_XX__XX__XX_),scalar(2),loop).

initialize(set_value(resource(r_1_XX_),scalar(10))).
initialize(set_value(resource(r_2_XX_),scalar(6))).

precondition(ge(resource(r_1_XX_),scalar(0)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),move_away(entity(e_2_XX_),entity(e_3_XX_),scalar(4))).
result(outcome(o_1_XX_),move_towards(entity(e_3_XX_),entity(e_3_XX_),scalar(4))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_2_XX_)).
result(outcome(o_2_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_3_XX_),entity(e_3_XX_),true),outcome(o_3_XX_)).
precondition(ge(resource(r_2_XX_),scalar(5)),outcome(o_3_XX_)).
result(outcome(o_3_XX_),decrease_over_time(resource(r_1_XX_),scalar(1))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_4_XX_)).
result(outcome(o_4_XX_),increase(resource(r_2_XX_),scalar(5))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_5_XX_)).
precondition(overlaps(entity(e_3_XX_),entity(e_3_XX_),false),outcome(o_5_XX_)).
result(outcome(o_5_XX_),increase(resource(r_1_XX_),scalar(6))).

precondition(control_event(click(entity(e_1_XX_))),outcome(o_6_XX_)).
precondition(le(resource(r_1_XX_),scalar(9)),outcome(o_6_XX_)).
result(outcome(o_6_XX_),delete(entity(e_1_XX_))).

precondition(timer_elapsed(patrol_entity_e_2_XX__XX__XX_),outcome(patrol_entity_e_2_XX__XX__XX_)).
result(outcome(patrol_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(90))).
result(outcome(patrol_entity_e_2_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).
result(outcome(patrol_entity_e_2_XX__XX__XX_),add(entity(e_1_XX_),scalar(1),location(middle,right))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(2))).
result(tick,apply_restitution(entity(e_2_XX_),entity(e_2_XX_))).
result(tick,apply_restitution(entity(e_3_XX_),entity(e_3_XX_))).

reading(bad,outcome(o_3_XX_)).
reading(bad,outcome(patrol_entity_e_2_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_5_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(location(middle,right),entity(e_1_XX_))).
reading(flees,relation(entity(e_2_XX_),entity(e_3_XX_))).
reading(consts,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(costs,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(stakes(low),resource(r_1_XX_)).
reading(stakes(low),resource(r_2_XX_)).
reading(outcome_helps,relation(outcome(o_5_XX_),resource(r_1_XX_))).

==========
<ul>
<li>The goal is to produce concentration</li>

<li>The player will do this by<ul>
<li>
	clicking on a [[red|circle]]
	 at the same time as
	attempting to keep a [[green|circle]] and [[green|circle]] from touching
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking on a [[red|circle]]
</li>
</ul></ul>