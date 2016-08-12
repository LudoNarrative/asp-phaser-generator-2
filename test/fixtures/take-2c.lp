entity(e1).
entity(e2).

resource(r1).
resource(r2).

many(e1).
many(e2).

initialize(add(e1,upper_right)).
initialize(add(e2,center)).
initialize(set_sprite(e1,square)).
initialize(set_sprite(e2,square)).
initialize(set(r1,high)).
initialize(set(r2,medium)).

goal(prevent(o7)).
goal(maintain(r1)).

controlLogic(draggable(e1)).

precondition(overlaps(e1,e2,true),o3).
precondition(control_event(click(e2)),o3).
result(o3,delete(e1)).
result(o3,delete(e2)).
result(o3,increase(r1,low)).
result(o3,increase(r2,high)).

precondition(ge(r2,medium),o4).
precondition(control_event(button(mouse_button,held)),o4).
result(o4,decrease(r1,low)).

precondition(ge(r1,0),o1).
precondition(control_event(button(mouse_button,held)),o1).
result(o1,decrease(r2,r1)).

precondition(le(r1,medium),o7).
result(o7,mode_change(game_loss)).

precondition(overlaps(e1,e2,true),o6).
precondition(le(r1,0),o6).
result(o6,delete(e1)).
result(o6,delete(e2)).

precondition(le(r1,r2),o5).
precondition(control_event(button(mouse_button,held)),o5).
result(o5,increase(r2,medium)).

precondition(le(r1,low),o2).
precondition(control_event(click(e1)),o2).
result(o2,delete(e1)).
result(o2,increase(r2,high)).

precondition(tick,tick).
result(tick,moves(e1,forward)).
result(tick,move_towards(e1,cursor)).
result(tick,move_towards(e1,e2)).
result(tick,increase(r2,low)).
result(tick,decrease(r1,medium)).
