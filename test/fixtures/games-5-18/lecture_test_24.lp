label(resource(r_1_XX_),concentration).
label(entity(e_1_XX_),e1).
label(entity(e_2_XX_),e(2)).

entity(e_1_XX_).
entity(e_2_XX_).

resource(r_1_XX_).

singular(entity(e_1_XX_)).

many(entity(e_2_XX_)).

initialize(set_draggable(entity(e_1_XX_),true)).
initialize(add(entity(e_1_XX_),scalar(1),location(middle,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(top,center))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,left))).
initialize(add(entity(e_2_XX_),scalar(1),location(bottom,right))).
initialize(set_color(entity(e_1_XX_),red)).
initialize(set_sprite(entity(e_1_XX_),circle)).
initialize(set_sprite(entity(e_2_XX_),circle)).
initialize(set_color(entity(e_2_XX_),blue)).

controlLogic(draggable(entity(e_1_XX_))).

timer_logic(timer(patrol_entity_e_2_XX__XX__XX_),scalar(3),loop).
timer_logic(timer(wander_entity_e_2_XX__XX__XX_),scalar(2),loop).

initialize(set_value(resource(r_1_XX_),scalar(10))).

precondition(le(resource(r_1_XX_),scalar(0)),outcome(o_1_XX_)).
result(outcome(o_1_XX_),mode_change(game_loss)).

precondition(overlaps(entity(e_1_XX_),entity(e_2_XX_),true),outcome(o_2_XX_)).
result(outcome(o_2_XX_),increase_over_time(resource(r_1_XX_),scalar(1))).

precondition(timer_elapsed(patrol_entity_e_2_XX__XX__XX_),outcome(patrol_entity_e_2_XX__XX__XX_)).
result(outcome(patrol_entity_e_2_XX__XX__XX_),rotates(entity(e_2_XX_),cw,scalar(10))).
result(outcome(patrol_entity_e_2_XX__XX__XX_),decrease(resource(r_1_XX_),scalar(1))).

precondition(timer_elapsed(wander_entity_e_2_XX__XX__XX_),outcome(wander_entity_e_2_XX__XX__XX_)).
result(outcome(wander_entity_e_2_XX__XX__XX_),rotate_to(entity(e_2_XX_),random_int(scalar(0),scalar(360)))).

precondition(tick,tick).
result(tick,moves(entity(e_2_XX_),forward,scalar(4))).
result(tick,decrease_over_time(resource(r_1_XX_),scalar(1))).

reading(bad,tick).
reading(bad,outcome(patrol_entity_e_2_XX__XX__XX_)).
reading(good,resource(r_1_XX_)).
reading(good,outcome(o_2_XX_)).
reading(good,entity(e_2_XX_)).
reading(hand_eye_coordination,game).
reading(maintenance,resource(r_1_XX_)).
reading(goal(produce),resource(r_1_XX_)).
reading(produces,relation(entity(e_1_XX_),resource(r_1_XX_))).
reading(produces,relation(entity(e_2_XX_),resource(r_1_XX_))).

==========
<ul>
<li>The goal is to produce concentration</li>

<li>They will do this by<ul>
<li>
attempting to make a [[blue|circle]] and [[red|circle]] touch
</li>
</ul></li>
<li>The player controls the game by<ul>
<li>
	clicking-and-dragging [[red|circle]]s
</li>
</ul></ul>