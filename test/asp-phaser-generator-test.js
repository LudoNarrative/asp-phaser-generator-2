require("amd-loader");
var test = require('tape');
var fs = require('fs');
var AspPhaserGenerator = require('../index');
var aspGame = fs.readFileSync('./test/fixtures/set_value.lp', 'utf8');
var initialPhaserFile = JSON.parse(fs.readFileSync('./test/fixtures/initial-phaser-file.json', 'utf8'));

test('given an ASP game, it generates a string', function (t) {
    var generator = new AspPhaserGenerator.AspPhaserGenerator(aspGame,initialPhaserFile);
    var output = AspPhaserGenerator.generate(generator.aspGame, generator.initialPhaser, false);
    t.equal('string', typeof output);
    t.end();
});
