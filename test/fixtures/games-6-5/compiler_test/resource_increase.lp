resource(r1).
resource(r2).

initialize(set_value(resource(r1),scalar(0))).
initialize(set_value(resource(r2),scalar(1))).

precondition(control_event(button(mouse,pressed)),outcome(o1)).
result(outcome(o1),increase(resource(r1),resource(r2)).
result(outcome(o1),increase(resource(r2),scalar(1)).
