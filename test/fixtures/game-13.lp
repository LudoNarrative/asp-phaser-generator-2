entity(e1).
entity(e2).

resource(r1).

many(e1).

many(e2).

static(e2).

controlLogic(draggable(e1)).

goal(prevent(o2)).
goal(maintain(r1)).

initialize(set_sprite(e1,circle)).
initialize(set_color(e1,white)).
initialize(add(e1,1,location(middle,center))).

initialize(set_sprite(e2,circle)).
initialize(set_color(e2,blue)).
initialize(add(e2,1,location(middle,left))).
initialize(add(e2,1,location(middle,right))).

initialize(set(r1,high)).

timerLogic(t1,5,loop).

precondition(timerElapsed(t1),t1).
result(t1,add(e1,1,location(middle,center))).

precondition(overlaps(e1,e2,true),o1).
result(o1,delete(e1)).
result(o1,increase(r1,high)).

precondition(le(r1,0),o2).
result(o2,mode_change(narrative_progression)).

precondition(tick,tick).
result(tick,decrease_over_time(r1,low)).

apply_restitution(e1,e1).
