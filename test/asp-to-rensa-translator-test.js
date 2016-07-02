var test = require('tape');
var fs = require('fs');
var translateAsp = require('../src/asp-to-rensa-translator');
var aspGameLines = fs.readFileSync('./test/fixtures/asp-game-1.lp', 'utf8').split('\n');

test('given ASP game array, it generates a list of assertions', function (t) {
  var output = translateAsp(aspGameLines);
  t.ok(output instanceof Array);
  t.end();
});

test('each generated assertion has a left, right, and relation', function(t) {
  var output = translateAsp(aspGameLines);
  var firstElement = output[0];
  t.ok(firstElement.l);
  t.ok(firstElement.r);
  t.ok(firstElement.relation);
  t.end();
});
