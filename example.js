require("amd-loader");  //enables amd style requires to be interpreted by running node.
var fs = require('fs');
var AspPhaserGenerator = require('./index');

var aspGame = fs.readFileSync('./test/fixtures/game-6_2.lp', 'utf8');
var initialPhaserFile = fs.readFileSync('./test/fixtures/initial-phaser-file.json', 'utf8');

//apparantly we need to use JSON.parse now; if we don't, initialPhaserFile gets interpreted as a string.
initialPhaserFile = JSON.parse(initialPhaserFile);

//A quirk of amd-loader: AspPhaserGenerator is at this point an object, with a method called AspPhaserGenerator
//var generator = new AspPhaserGenerator(aspGame, initialPhaserFile);
var generator = new AspPhaserGenerator.AspPhaserGenerator(aspGame, initialPhaserFile)

//var phaserProgram = generator.generate(true);
var phaserProgram = AspPhaserGenerator.generate(generator.aspGame, generator.initialPhaser, false)

//console.log("\n------------------------------");
//console.log("Finished Phaser game:");
//console.log("------------------------------");
console.log(phaserProgram);
