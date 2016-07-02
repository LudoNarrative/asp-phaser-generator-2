var test = require('tape');
var fs = require('fs');
var AspPhaserGenerator = require('../index');
var aspGame = fs.readFileSync('./test/fixtures/asp-game-1.lp', 'utf8');

test('given an ASP game, it generates a string', function (t) {
  var output = new AspPhaserGenerator(aspGame).generate();
  t.equal('string', typeof output);
  t.end();
});
