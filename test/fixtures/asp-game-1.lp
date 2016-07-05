resource(r1).
initialize(set_value(r1, low)).

precondition(le(r1, med), o1).
result(o1, increase(r1, low)).
