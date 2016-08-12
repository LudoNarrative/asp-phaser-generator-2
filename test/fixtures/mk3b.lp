entity(e1).
entity(e2).

resource(r1).

singular(e2).

many(e1).

initialize(add(e1,lower_left)).
initialize(add(e2,upper_right)).
initialize(set_sprite(e1,square)).
initialize(set_sprite(e2,square)).
initialize(set(r1,high)).

goal(prevent(o4)).
goal(maintain(r1)).

precondition(control_event(button(mouse_button,held)),drawn_to_cursor(e1)).
result(drawn_to_cursor(e1),move_towards(e1,cursor)).

precondition(overlaps(e1,e2,true),o3).
precondition(le(r1,medium),o3).
result(o3,increase(r1,high)).

precondition(le(r1,low),o4).
result(o4,mode_change(game_loss)).

precondition(le(r1,mid),o1).
precondition(control_event(button(mouse_button,pressed)),o1).
result(o1,increase(r1,low)).

precondition(ge(r1,low),o2).
precondition(control_event(button(mouse_button,pressed)),o2).
result(o2,decrease(r1,low)).

precondition(tick,tick).
result(tick,move_away(e2,e1)).
result(tick,decrease(r1,low)).
