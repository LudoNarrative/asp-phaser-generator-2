entity(e1)
entity(e2)

resource(r1)
resource(r2)

many(e1)
many(e2)

timerLogic(t1,3,single)

initialize(add(e1,upper_left))
initialize(add(e2,lower_left))
initialize(set_sprite(e1,circle))
initialize(set_sprite(e2,triangle))
initialize(set(r1,high))
initialize(set(r2,0))

goal(prevent(o4))
goal(maintain(r1))

precondition(overlaps(e1,e2,true),o3)
result(o3,delete(e1))
result(o3,delete(e2))
result(o3,decrease(r1,r2))
result(o3,decrease(r2,low))

precondition(le(r1,0),o4)
result(o4,mode_change(game_loss))

precondition(near(e1,e2),o1)
precondition(control_event(button(mouse_button,pressed)),o1)
result(o1,delete(e1))
result(o1,delete(e2))
result(o1,increase(r1,r2))
result(o1,increase(r2,r1))

precondition(ge(r2,high),o5)
result(o5,decrease(r1,low))

precondition(timerElapsed(t1),o2)
result(o2,increase(r2,r1))
result(o2,decrease(r1,r2))

precondition(tick,tick)
result(tick,move_away(e1,cursor))
result(tick,move_away(e1,e2))
result(tick,move_away(e2,cursor))
result(tick,decrease(r1,high))
