require("amd-loader");
var test = require('tape');
var fs = require('fs');
var translateASP = require('../src/asp-to-cygnus-2.js').translateASP;
var aspGame = fs.readFileSync('./test/fixtures/set_value.lp', 'utf8').split("\n");

test('given ASP game array, it generates a list of assertions', function (t) {
    var output = translateASP(aspGame);
    t.ok(output instanceof Array);
    t.end();
});

test('each generated assertion has a left, right, and relation', function(t) {
    var output = translateASP(aspGame);
    var firstElement = output[0];
    t.ok(firstElement.l);
    t.ok(firstElement.r);
    t.ok(firstElement.relation);
    t.end();
});
