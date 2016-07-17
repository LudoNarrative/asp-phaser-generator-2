var fs = require('fs');
var AspPhaserGenerator = require('./index');
/*
Dinner: 2
Worker: 3
Travel: 5
Lecture: 4
*/
var aspGame = fs.readFileSync('./test/fixtures/generated-3.lp', 'utf8');
var initialPhaserFile = fs.readFileSync('./test/fixtures/initial-phaser-file-generated.json', 'utf8');

var generator = new AspPhaserGenerator(aspGame, initialPhaserFile);
var phaserProgram = generator.generate(true);

console.log("\n------------------------------");
console.log("Finished Phaser game:");
console.log("------------------------------");
console.log(phaserProgram);
