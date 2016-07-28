var translateAsp = require('./src/asp-to-cygnus');
var rensa = require('./src/brain');
var ctp = require('./src/cygnus-to-phaser-brain');
var translatePhaserBrain = require('./src/phaser-brain-to-code');

function AspPhaserGenerator(generatedAsp, initialPhaserFile) {
  // Read each line of the ASP game.
  var lines = generatedAsp.split('\n');
  // For each line read,
  for (var i=0; i<lines.length;i++){
    // Remove any extra spaces,and add a period at the end if there isn't one.
    lines[i] = lines[i].replace(/\s+/g, '');
    if (lines[i]!="" && lines[i].slice(-1)!="."){
      lines[i] = lines[i]+".";
    }
    // Remove redundant button information.
    lines[i] = lines[i].replace("control_event(button(mouse_button,held))", 'control_event(mouse_button,held)');
    lines[i] = lines[i].replace("control_event(button(mouse_button,pressed))", 'control_event(mouse_button,pressed)');
  }

  // Store the ASP game.
  this.aspGame = lines;
    
  // Store the initial Phaser file as a brain.
  this.initialPhaser = rensa.makeBrain(JSON.parse(initialPhaserFile));
}

AspPhaserGenerator.prototype.generate = function(debug) {
  // Create a Rensa brain from literal ASP.
  var cygnus = rensa.makeBrain(translateAsp(this.aspGame));

  // Translate this brain into Phaser Abstract Syntax given some initial Phaser assertions.
  var generatedPhaserBrain = ctp.cygnusToPhaser(this.initialPhaser, cygnus);

  // Write a Phaser program using this brain.
  var gameProgram = translatePhaserBrain.writePhaserProgram(generatedPhaserBrain);

  // If debug flag is true, show output at each step.
  if (debug){
    console.log("\n------------------------------");
    console.log("Initial Phaser Brain: ");
    console.log("------------------------------");
    this.initialPhaser.prettyprint();
    console.log("\n------------------------------");
    console.log("Cygnus Brain: ");
    console.log("------------------------------");
    cygnus.prettyprint();
    console.log("\n------------------------------");
    console.log("Generated Phaser Brain: ");
    console.log("------------------------------");
    generatedPhaserBrain.prettyprint();
  }
  return gameProgram;
};

module.exports = AspPhaserGenerator;
