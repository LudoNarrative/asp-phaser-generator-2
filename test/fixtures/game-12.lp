entity(e1).
entity(e2).

resource(r1).

singular(e1).

many(e2).

goal(prevent(o2)).
goal(maintain(r1)).

initialize(set_sprite(e1,square)).
initialize(set_color(e1,green)).
initialize(add(e1,1,location(middle,center))).
rotate_to(e1,random_int(0,360)).


initialize(set_sprite(e2,circle)).
initialize(set_color(e2,blue)).
initialize(add(e2,1,location(top,left))).
initialize(add(e2,1,location(top,right))).
initialize(add(e2,1,location(bottom,left))).
initialize(add(e2,1,location(bottom,right))).
rotate_to(e2,random_int(0,360)).


initialize(set(r1,high)).


timerLogic(t1,10,loop).
timerLogic(t2,5,loop).

precondition(control_event(button(mouse_button,pressed)),o3).
precondition(overlaps(e1,e2,false),o3).
result(o3,increase(r1,high)).

precondition(timerElapsed(t2),t2).
result(t2,rotate_to(e2,random_int(0,360))).

precondition(le(r1,0),o2).
result(o2,mode_change(game_loss)).

precondition(tick,tick).
result(tick,moves(e1,forward)).
result(tick,moves(e2,forward)).
result(tick,decrease_over_time(r1,low)).

precondition(control_event(button(mouse_button,pressed)),o1).
precondition(overlaps(e1,e2,true),o1).
result(o1,decrease(r1,medium)).

precondition(timerElapsed(t1),t1).
result(t1,rotate_to(e1,random_int(0,360))).

apply_restitution(e1,e2).

apply_restitution(e1,e1).

apply_restitution(e2,e2).
