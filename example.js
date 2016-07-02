var AspPhaserGenerator = require('./index');

var aspGame = "resource(r1).\ninitialize(set_value(r1,low)).\nprecondition(le(r1,med),o1).\nresult(o1,increase(r1,low)).";

var generator = new AspPhaserGenerator(aspGame);
var phaserProgram = generator.generate();

console.log("Generated phaser program: ");
console.log(phaserProgram);
