entity(e1).
entity(e2).

resource(r1).

singular(e1).
singular(e2).

initialize(add(e1,random)).
initialize(add(e2,random)).
initialize(set_sprite(e1,star)).
initialize(set_sprite(e2,pentagon)).
initialize(set(r1,high)).

goal(prevent(o4)).
goal(maintain(r1)).

precondition(control_event(button(mouse_button,held)),drawn_to_cursor(e1)).
result(drawn_to_cursor(e1),move_towards(e1,cursor)).

precondition(ge(r1,high),o3).
precondition(control_event(click(e1)),o3).
result(o3,decrease(r1,medium)).

precondition(le(r1,0),o4).
result(o4,mode_change(game_loss)).

precondition(le(r1,low),o1).
precondition(control_event(click(e1)),o1).
result(o1,increase(r1,low)).

precondition(overlaps(e1,e2,true),o2).
precondition(le(r1,medium),o2).
result(o2,increase(r1,high)).

precondition(tick,tick).
result(tick,move_towards(e1,e2)).
result(tick,move_towards(e2,e1)).
result(tick,decrease(r1,low)).
