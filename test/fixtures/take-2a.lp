entity(e1).
entity(e2).

resource(r1).
resource(r2).

singular(e2).

many(e1).

initialize(add(e1,lower_right)).
initialize(add(e2,center)).
initialize(set_sprite(e1,triangle)).
initialize(set_sprite(e2,circle)).
initialize(set(r1,high)).
initialize(set(r2,high)).

goal(prevent(o7)).
goal(maintain(r1)).

controlLogic(draggable(e1)).
controlLogic(draggable(e2)).

precondition(ge(r2,high),o3).
precondition(control_event(click(e2)),o3).
result(o3,add(e1,lower_left)).
result(o3,increase(r1,r2)).

precondition(le(r1,low),o4).
precondition(control_event(button(mouse_button,held)),o4).
result(o4,add(e1,lower_left)).
result(o4,decrease(r2,low)).

precondition(ge(r1,medium),o1).
precondition(control_event(button(mouse_button,held)),o1).
result(o1,add(e1,lower_left)).
result(o1,increase(r2,low)).

precondition(le(r1,0),o7).
result(o7,mode_change(game_loss)).

precondition(ge(r2,high),o6).
precondition(control_event(click(e1)),o6).
result(o6,add(e1,upper_right)).

precondition(ge(r2,r1),o5).
precondition(control_event(button(mouse_button,held)),o5).
result(o5,add(e1,center)).
result(o5,increase(r1,r2)).

precondition(overlaps(e1,e2,true),o2).
precondition(ge(r2,high),o2).
result(o2,add(e1,center)).

precondition(tick,tick).
result(tick,move_towards(e1,e2)).
result(tick,move_towards(e2,cursor)).
result(tick,increase(r2,r1)).
result(tick,decrease(r1,low)).
