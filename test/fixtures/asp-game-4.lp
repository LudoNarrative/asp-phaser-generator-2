resource(r1).
entity(e1).
entity(e2).

initialize(set(r1, low)).

initialize(add(e1, random)).
initialize(add(e2, random)).

initialize(set_sprite(e1, star)).
initialize(set_sprite(e2, circle)).

move(e1, southwest).

precondition(tick,tick)
result(tick,move_away(e1,cursor))
result(tick,move_away(e1,e2))
result(tick,move_away(e2,cursor))
result(tick,decrease(r1,high))
