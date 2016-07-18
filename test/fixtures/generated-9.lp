entity(e1).
entity(e2).

resource(r1).
resource(r2).

many(e1).
many(e2).

initialize(add(e1,upper_left)).
initialize(add(e2,center)).
initialize(set_sprite(e1,pentagon)).
initialize(set_sprite(e2,square)).
initialize(set(r1,high)).
initialize(set(r2,high)).

goal(prevent(o1)).
goal(maintain(r1)).

controlLogic(draggable(e2)).

precondition(overlaps(e1,e2,true),o3).
result(o3,delete(e1)).
result(o3,delete(e2)).
result(o3,increase(r2,low)).
result(o3,decrease(r1,medium)).

precondition(le(r1,medium),o1).
result(o1,mode_change(game_loss)).

precondition(tick,tick).
result(tick,moves(e2,forward,low)).
result(tick,move_towards(e1,e2)).
result(tick,decrease(r1,r2)).
result(tick,decrease(r2,medium)).
