var variables;
var gridSize;
var gridLinesHorizontal;
var gridLinesVertical;
var grid;
var gridIdx;
var addedEntities;
var labels;
var good_sound;
var bad_sound;
var low;
var medium;
var mid;
var high;
var walls;
var xOffset;
var yOffset;
var lossTextDisplayed;
var goals;
var pools = {};
var pool_counters = {};
pools['e_1_XX_'] = [];
pool_counters['e_1_XX_'] = 0;
pools['e_1_XX_'].push({'x':190,'y':160});
pools['e_2_XX_'] = [];
pool_counters['e_2_XX_'] = 0;
pools['e_2_XX_'].push({'x':50,'y':50});
pools['e_2_XX_'].push({'x':50,'y':250});
pools['e_2_XX_'].push({'x':300,'y':50});
pools['e_2_XX_'].push({'x':300,'y':250});
var e_1_XX_;
var e_2_XX_;
var r_1_XX_;
function preload(){
	game.load.image('e_1_XX_','assets/sprites/circle.png');

	game.load.image('e_2_XX_','assets/sprites/circle.png');

	game.load.audio('good_sound', 'assets/sounds/good.wav');
	game.load.audio('bad_sound', 'assets/sounds/bad.wav');};

function create(){
	graphics = game.add.graphics( 0,0);
	graphics.beginFill(0x000000);
	graphics.drawRoundedRect(xOffset,yOffset, 400, 300, 10);
	graphics.endFill();
	graphics.alpha = 0.2;

	variables={'confidence':'5','optimism':'2','difficulty':'3'};
	gridSize=30;
	gridLinesHorizontal=Math.floor((game.width-1)/gridSize);
	gridLinesVertical=Math.floor((game.height-1)/gridSize);
	grid=initGrid();
	gridIdx=0;
	addedEntities={};
	labels={};
	low=1;
	medium=6;
	mid=medium;
	high=11;
	xOffset=50;
	yOffset=50;
	lossTextDisplayed=false;
	goals=[];

	e_1_XX_=game.add.physicsGroup();
	addedEntities['e_1_XX_']=e_1_XX_;
	initEntityProperties(e_1_XX_);

	e_2_XX_=game.add.physicsGroup();
	addedEntities['e_2_XX_']=e_2_XX_;
	initEntityProperties(e_2_XX_);
	r_1_XX_=0;

	setUpSlowDown();

	var x=190+ xOffset;var y=160+ yOffset;for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_1_XX_'].length < 20){
			initEntity(addedEntities['e_1_XX_'].create(x,y,'e_1_XX_'));
			updateGrid();
		}
		}
	var x=50+ xOffset;var y=50+ yOffset;for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_2_XX_'].length < 20){
			initEntity(addedEntities['e_2_XX_'].create(x,y,'e_2_XX_'));
			updateGrid();
		}
		}
	var x=50+ xOffset;var y=250+ yOffset;for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_2_XX_'].length < 20){
			initEntity(addedEntities['e_2_XX_'].create(x,y,'e_2_XX_'));
			updateGrid();
		}
		}
	var x=300+ xOffset;var y=50+ yOffset;for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_2_XX_'].length < 20){
			initEntity(addedEntities['e_2_XX_'].create(x,y,'e_2_XX_'));
			updateGrid();
		}
		}
	var x=300+ xOffset;var y=250+ yOffset;for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_2_XX_'].length < 20){
			initEntity(addedEntities['e_2_XX_'].create(x,y,'e_2_XX_'));
			updateGrid();
		}
		}
good_sound =  game.add.audio('good_sound');
bad_sound =  game.add.audio('bad_sound');

	labels['e_1_XX_'] = {};labels['e_1_XX_'].name = 'e1';labels['e_1_XX_'].variable = 'e_1_XX_';labels['e_1_XX_'].readWrite = 'private';labels['e_1_XX_'].value = e_1_XX_;
	labels['r_1_XX_'] = {};labels['r_1_XX_'].name = 'stress';labels['r_1_XX_'].variable = 'r_1_XX_';labels['r_1_XX_'].readWrite = 'private';labels['r_1_XX_'].value = r_1_XX_;
	labels['e_2_XX_'] = {};labels['e_2_XX_'].name = 'e';labels['e_2_XX_'].variable = 'e_2_XX_';labels['e_2_XX_'].readWrite = 'private';labels['e_2_XX_'].value = e_2_XX_;
	labels['r_1_XX_'] = {};labels['r_1_XX_'].name = 'r';labels['r_1_XX_'].variable = 'r_1_XX_';labels['r_1_XX_'].readWrite = 'private';labels['r_1_XX_'].value = r_1_XX_;
	
	
	
	
	
	game.time.events.loop(Phaser.Timer.SECOND*7, wander_entity_e_2_XX__XX__XX__wander_entity_e_2_XX__XX__XX_Listener, this);

	
	var barConfig0 = createProgressBarConfig(r_1_XX_, 0, labels['r_1_XX_'].name);
	this.resourceBar0 = new HealthBar(this.game, barConfig0)
	addBarLabel(barConfig0, 0, labels['r_1_XX_'].name);
	
	var percent0 = r_1_XX_/10;
	percent0 = percent0 * 100;
	this.resourceBar0.setPercentNow(percent0);
	
	game.time.events.loop(Phaser.Timer.SECOND * 10, informNarrativeOfUpdatedVariables, this);
	};

function update(){
	for(var k in addedEntities) {if (addedEntities.hasOwnProperty(k)) {
		var entity = addedEntities[k];
		entity.forEach(function(item) {
		item.body.velocity.x *= 0.9;
		item.body.velocity.y *= 0.9;
		item.invincible = false;
		}, this);
	}}

	addedEntities['e_2_XX_'].forEach(function(item){item.health = item.health+7/160;}, this);
	game.physics.arcade.overlap(addedEntities['e_1_XX_'],addedEntities['e_2_XX_'],o_2_XX_OverlapHandler,null, this);
	if(game.input.activePointer.leftButton.isDown){
		addedEntities['e_2_XX_'].forEach(function(item){item.health = item.health-6/160;}, this);
	addedEntities['e_1_XX_'].forEach(function(item){item.angle += -1;}, this);
		}

	if(r_1_XX_>=32){
		changeMode('game_loss');

		}

	addedEntities['e_1_XX_'].forEach(function(item) {
		move_forward(item,7);
}, this);

	addedEntities['e_2_XX_'].forEach(function(item) {
		move_forward(item,3);
}, this);

	addedEntities['e_2_XX_'].forEach(function(item) {
		move_left(item,3);
}, this);

	game.physics.arcade.collide(e_1_XX_,walls,null,null,this);
	game.physics.arcade.collide(e_2_XX_,walls,null,null,this);
	addedEntities['e_1_XX_'].forEach(function(item){item.tint=0xff0000;}, this);
	addedEntities['e_2_XX_'].forEach(function(item){item.tint=0x0000ff;}, this);
	game.physics.arcade.collide(e_1_XX_,e_1_XX_,null,null,this);
	game.physics.arcade.collide(e_2_XX_,e_2_XX_,null,null,this);
		//Make all instances of e_2_XX_look at an instance of e_1_XX_ using choice parameter: furthest
		addedEntities['e_2_XX_'].forEach(function(lookerItem) {
			var curBestDistance = undefined;
			var curBestIndex = -1;
			var curIndex = 0;
			addedEntities['e_1_XX_'].forEach(function(lookedAtItem){
				var distance = Phaser.Math.distance(lookerItem.x, lookerItem.y, lookedAtItem.x, lookedAtItem.y);
				var index;
				if(curBestDistance === undefined || curBestDistance < distance){
					curBestIndex = curIndex;
					curBestDistance = distance;
				}
				curIndex += 1;
			},this);
			var targetItem = addedEntities['e_1_XX_'].children[curBestIndex];
			if(targetItem !== undefined){
				var newAngle = Math.atan2(targetItem.y - lookerItem.y, targetItem.x - lookerItem.x);
				newAngle = newAngle * (180/Math.PI); //convert from radians to degrees.
				lookerItem.angle = newAngle;
			}
		},this);
	for(var k in addedEntities) {if (addedEntities.hasOwnProperty(k)) {
		var entity = addedEntities[k];
		entity.forEach(function(item) {
		item.body.velocity.clamp(-300,300);
			item.health = Math.max(0, Math.min(item.health, 100));
			item.alpha = item.health/100;
			if(item.x + item.width/2 > xOffset + 400){item.x = -item.width/2 + xOffset + 400;}  if(item.x - item.width/2 < xOffset){item.x=xOffset+item.width/2;} if(item.y + item.height/2 > yOffset + 300){item.y = -item.height/2 + yOffset + 300;} if(item.y - item.height/2 < yOffset){item.y=yOffset+item.height/2;}

		if(item.deleted && !item.invincible){item.destroy();}
		}, this);
	}}

	if(r_1_XX_ > 10){
		r_1_XX_ = 10;
	}
	else if (r_1_XX_ < 0 ){
		r_1_XX_ = 0;
	}
	updateLabelsWithVariableValues()
	var percent0 = r_1_XX_/10;
	percent0 = percent0 * 100;
	this.resourceBar0.setPercent(percent0);
	
	markZeroHealthEntitiesForDeletion();
	};

function render(){};

function o_2_XX_OverlapHandler(e1,e2){
	
	
	if (e1.deleted || e1.invincible){ console.log('e1.deleted'); return;}
if (e2.deleted || e1.invincible){ console.log('e2.deleted');return;}
console.log('No one deleted');
r_1_XX_=r_1_XX_-24/4;

	
	if (typeof e1 !== 'undefined' && e1.key === 'e_2_XX_'){
		e1.deleted = true;
	}
	if (typeof e2 !== 'undefined' && e2.key === 'e_2_XX_'){
		e2.deleted = true;
	}
	if (typeof clickedOnObject !== 'undefined'){
		clickedOnObject.deleted = true;
	}

		
};

function wander_entity_e_2_XX__XX__XX__wander_entity_e_2_XX__XX__XX_Listener(){
	addedEntities['e_2_XX_'].forEach(function(item){item.angle = Math.random() * (360-0) + 0;}, this);
	r_1_XX_=r_1_XX_+1/4;

	for (var ii = 0; ii < 1; ii++){
		
		if(addedEntities['e_2_XX_'].length < 20){
			pool_counters['e_2_XX_'] = (pool_counters['e_2_XX_'] + 1) % pools['e_2_XX_'].length;

	x= pools['e_2_XX_'][pool_counters['e_2_XX_']].x+ xOffset;

	y= pools['e_2_XX_'][pool_counters['e_2_XX_']].y+ yOffset;

	initEntity(addedEntities['e_2_XX_'].create(x,y,'e_2_XX_'));
			updateGrid();
		}
		}
		
};

function setVariable(varName,value){
	variables[varName]=value;
	//State.set(varName, value.toFixed(1));
	//console.log('setting varName: ' , varName , ' to ' , value);
	State.set(varName, value);
	Display.setAvatars(State);
	Display.setStats('storyStats');
	StoryAssembler.refreshNarrative();
};

function getVariable(varName){
	return variables[varName];
};

function informNarrativeOfUpdatedVariables(){
	for (i = 0; i < Object.keys(labels).length; i += 1) {
	var variableName = Object.keys(labels)[i];
	    if(labels[variableName].readWrite === 'write'){
	      setVariable(labels[variableName].name, labels[variableName].value);
	    }
	  }
};

function updateLabelsWithVariableValues(){
	for (i = 0; i < Object.keys(labels).length; i += 1) {
	 var variableName = Object.keys(labels)[i];
	 labels[variableName].value = eval(Object.keys(labels)[i]);
	}
};

function getRandomPoint(){
	var x=game.rnd.integerInRange(0,game.world.width-1);
	var y=game.rnd.integerInRange(0,game.world.height-1);
	return new Phaser.Point(x,y);
};

function initGrid(){
	grid=[];
	for(var i=0;i<gridLinesHorizontal;i++){for(var j=0;j<gridLinesVertical;j++){grid.push(new Phaser.Point(i*gridSize,j*gridSize));}}
	shuffle(grid);
	return grid;
};

function updateGrid(sprite){
	gridIdx++;
	if(gridIdx===grid.length){gridIdx=0;shuffle(grid);}
};

function shuffle(a){
	var j,x,i;
	for(i=a.length;i;i--){j=Math.floor(Math.random()*i);x=a[i-1];a[i-1]=a[j];a[j]=x;}
};

function move_towards(e,dir,speed){
	e.body.velocity.x += dir.x*speed/8;
	e.body.velocity.y += dir.y*speed/8;
};

function move_away(e,dir,speed){
	e.body.velocity.x -= dir.x*speed/8;
	e.body.velocity.y -= dir.y*speed/8;
};

function moves(e,x,y){
	e.body.velocity.x += x;
	e.body.velocity.y += y;
};

function move_forward(e,amount){
	var newV = game.physics.arcade.velocityFromRotation(e.rotation,amount);
	e.body.velocity.x += newV.x;
	e.body.velocity.y += newV.y;
};

function move_left(e,amount){
	var newV = game.physics.arcade.velocityFromRotation(e.rotation-Math.PI*0.5,amount);
	e.body.velocity.x += newV.x;
	e.body.velocity.y += newV.y;
};

function move_right(e,amount){
	var newV = game.physics.arcade.velocityFromRotation(e.rotation+Math.PI*0.5,amount);
	e.body.velocity.x += newV.x;
	e.body.velocity.y += newV.y;
};

function move_backward(e,amount){
	var newV = game.physics.arcade.velocityFromRotation(e.rotation-Math.PI,amount);
	e.body.velocity.x += newV.x;
	e.body.velocity.y += newV.y;
};

function initEntityProperties(group){
	group.forEach(function(item) {
	item.deleted=false;
	item.body.collideWorldBounds = true;
	item.anchor.x = 0.5;
	item.anchor.y = 0.5;
	item.rotation = 0;
	item.health = 100;
	if (!item.body.velocity.hasOwnProperty('x')){item.body.velocity.x=0;}
	if (!item.body.velocity.hasOwnProperty('y')){item.body.velocity.y=0;}
	if (!item.body.hasOwnProperty('angularVelocity')){item.body.angularVelocity=0;}
	}, this);
};

function initEntity(item){
	item.deleted=false;
	item.invincible=true;
	item.body.collideWorldBounds = true;
	item.anchor.x = 0.5;
	item.anchor.y = 0.5;
	item.rotation = 0;
	item.health = 100;
	if (!item.body.velocity.hasOwnProperty('x')){item.body.velocity.x=0;}
	if (!item.body.velocity.hasOwnProperty('y')){item.body.velocity.y=0;}
	if (!item.body.hasOwnProperty('angularVelocity')){item.body.angularVelocity=0;}
};

function changeMode(newMode){
	if(newMode==='game_win'){
	 mode = 'win';
	 game.world.removeAll();
	 displayText('CLEARED');
	}
	else if(newMode==='game_loss'){
	 mode='loss';
	 game.stage.backgroundColor = '#400';
	 if(!lossTextDisplayed){
	   displayText('(Loss State Reached)');
	   lossTextDisplayed=true
	 }
	}
};

function displayText(t){
	var style = { font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'};
	text = game.add.text(0, 0, t, style);
};

function getAspGoals(){
	if (goals === undefined || goals.length == 0){return ['No ASP goals.'];}
	else{return goals;}
};

function setUpWalls(){
	walls = game.add.physicsGroup();
	var wall1 = walls.create(-100+xOffset,yOffset);
	wall1.width = 100;
	wall1.height = 1000;
	var wall2 = walls.create(xOffset,yOffset-100);
	wall2.width = 4000;
	wall2.height = 100;
	var wall3 = walls.create(400+xOffset,yOffset);
	wall3.width = 100;
	wall3.height = 3000;
	var wall4 = walls.create(xOffset,300+yOffset);
	wall4.width = 4000;
	wall4.height = 100;
	wall1.body.immovable = true;
	wall2.body.immovable = true;
	wall3.body.immovable = true;
	wall4.body.immovable = true;
};

function random_int(min,max){
	var random_integer = Math.random()*(max+1)|min;
	return random_integer;
};

function createProgressBarConfig(resourceValue,resourceCount,label){
	var barConfig = {};
	var barHeight = 18;
	var barWidth = 150;
	barConfig.height = barHeight;
	barConfig.width = barWidth;
	barConfig.x = 100 + (10 * resourceCount) + (barWidth * resourceCount);
	barConfig.y = 10;
	barConfig.bg = {};
	barConfig.bg.color = '#ffffff';
	barConfig.bar = {};
	barConfig.bar.color = '#ff00ff';
	return barConfig;
};

function addBarLabel(barConfig,resourceCount,label){
	var barWidth = 100;
	var barHeight = 40;
	var startX = barConfig.x;
	var startY = barConfig.y + 2;
	if(label !== undefined){
	  text = game.add.text(startX, startY, label);
	  text.anchor.set(0.5,0.5);
	  text.align = 'center';
	  //  Font style
	  text.font = 'Arial Black';
	  text.fontSize =16;
	  text.fontWeight = 'bold';
	  //text.width = barWidth;
	  //text.height = barHeight;
	  //  Stroke color and thickness
	  text.stroke = '#000000';
	  text.strokeThickness = 1;
	  text.fill = '#000000';
	}
};

function markZeroHealthEntitiesForDeletion(){
	for(var k in addedEntities) {
	 if (addedEntities.hasOwnProperty(k)) {
	   var entity = addedEntities[k];
	   entity.forEach(function(item) {
	     if(item.health <= 0){
	       item.deleted = true;
	     }
	   }, this);
	 }
	}
};

function leaveContext(){
	game.time.slowMotion = 2;
};

function enterContext(){
	game.time.slowMotion = 1;
};

function setUpSlowDown(){
	game.canvas.onmouseenter = enterContext;
	game.canvas.onmouseout = leaveContext;
};
