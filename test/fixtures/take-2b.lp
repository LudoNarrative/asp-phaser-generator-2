entity(e1).
entity(e2).

resource(r1).
resource(r2).

many(e1).
many(e2).

initialize(add(e1,random)).
initialize(add(e2,random)).
initialize(set_sprite(e1,square)).
initialize(set_sprite(e2,star)).
initialize(set(r1,low)).
initialize(set(r2,0)).

goal(prevent(o3)).
goal(maintain(r1)).

controlLogic(draggable(e2)).

precondition(le(r1,0),o3).
result(o3,mode_change(game_loss)).

precondition(ge(r1,medium),o4).
precondition(control_event(click(e2)),o4).
result(o4,delete(e2)).
result(o4,decrease(r2,medium)).

precondition(le(r1,r2),o1).
precondition(control_event(click(e2)),o1).
result(o1,delete(e2)).
result(o1,increase(r2,medium)).

precondition(overlaps(e1,e2,true),o7).
precondition(control_event(button(mouse_button,held)),o7).
result(o7,delete(e1)).
result(o7,delete(e2)).
result(o7,increase(r1,medium)).
result(o7,increase(r2,high)).

precondition(ge(r2,medium),o6).
precondition(control_event(click(e2)),o6).
result(o6,delete(e2)).

precondition(le(r2,r1),o5).
precondition(control_event(click(e2)),o5).
result(o5,delete(e2)).
result(o5,increase(r1,low)).

precondition(ge(r2,0),o2).
precondition(control_event(click(e1)),o2).
result(o2,delete(e1)).

precondition(tick,tick).
result(tick,moves(e2,forward,low)).
result(tick,move_towards(e2,cursor)).
result(tick,decrease(r1,r2)).
result(tick,decrease(r2,high)).
