entity(e1).
entity(e2).

resource(r1).

singular(e1).

many(e2).

initialize(add(e1,upper_left)).
initialize(add(e2,upper_left)).
initialize(set_sprite(e1,square)).
initialize(set_sprite(e2,square)).
initialize(set(r1,high)).

goal(prevent(o1)).
goal(maintain(r1)).

controlLogic(draggable(e1)).
controlLogic(draggable(e2)).

precondition(ge(r1,medium),o4).
precondition(control_event(button(mouse_button,held)),o4).
result(o4,decrease(r1,medium)).

precondition(overlaps(e1,e2,true),o3).
precondition(control_event(button(mouse_button,held)),o3).
result(o3,decrease(r1,medium)).

precondition(le(r1,low),o2).
precondition(control_event(button(mouse_button,held)),o2).
result(o2,increase(r1,medium)).

precondition(le(r1,medium),o1).
result(o1,mode_change(game_loss)).

precondition(tick,tick).
result(tick,move_towards(e2,cursor)).
result(tick,move_away(e2,e1)).
result(tick,decrease(r1,high)).
