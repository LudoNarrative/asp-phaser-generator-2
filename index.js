function AspPhaserGenerator(aspGame) {
  this.aspGame = aspGame;  
  this.aspGameLines = aspGame.split('\n');
}

AspPhaserGenerator.prototype.generate = function() {
  return "console.log('Hello, world.');"
};

module.exports = AspPhaserGenerator;
