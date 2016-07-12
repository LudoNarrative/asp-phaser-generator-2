resource(r1).
entity(e1).
entity(e2).

initialize(set(r1, low)).

initialize(add(e1, random)).
initialize(add(e2, random)).

move_toward(e1, e2).

initialize(set_sprite(e1, glowing_unicorn)).
initialize(set_sprite(e2, pineapple)).

precondition(control_event(click(e1)), o1).
result(o1, move_toward(e2, e1)).
result(o1, increase(r1, low)).
