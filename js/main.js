var canvas;
var stage;
var players = [];
var ground;
var lightBox;
var soundEnabled = true;
var soundsRegistered = false;

var DIRECTION_LEFT = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_UP = 2;
var DIRECTION_DOWN = 3;

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  Q: 81,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    //activate sound effects
    if(!soundsRegistered){registerSounds();soundsRegistered = true;}
    this._pressed[event.keyCode] = true;
    if(event.keyCode == Key.LEFT || event.keyCode == Key.RIGHT || event.keyCode == Key.UP || event.keyCode == Key.DOWN || event.keyCode == Key.Q)
    if(record){recordEventKeyDown(event);}
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

function handleTick(event) {
  if (!event.paused) {
    players.forEach(function(player){
      updatePlayer(player);
    });
  }
  stage.update();
}

function init() {
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
  canvas = document.getElementById("canvas");
  canvas.width  = (window.innerWidth*.7)*2;
  canvas.height = (window.innerHeight)*2;
  canvas.style.width = (canvas.width / 2) + "px";
  canvas.style.height = (canvas.height / 2) + "px";

  //stage setup
  stage = new createjs.Stage("canvas");
  setupStage();
  //game loop reference
  createjs.Ticker.addEventListener("tick", handleTick);
  createjs.Ticker.framerate = 60;

  stage.update();
}

function setupStage(){
  stage.removeAllChildren();
  addGround();
  players = [];
  addPlayer(200,ground.y-400, true, false);
  addPlayer(canvas.width-200,ground.y-400, true, true);
  lightBox = new createjs.Shape();
  lightBox.alpha = 0;
  lightBox.graphics.beginFill("white").drawRect(0,0,canvas.width,canvas.height);
  stage.addChild(lightBox);
}

function addGround(){
  //the ground covers 1/5 of the screen, and is at the bottom
  ground = new createjs.Shape();
  ground.y = (canvas.height/5)*4;
  ground.graphics.beginFill("grey").drawRect(0,0,canvas.width, (canvas.height/5));
  stage.addChild(ground);
}

function addPlayer(x , y, overrideButtons, overrideIsComputer){

  var playerShape = new createjs.Container();

  playerShape.x = x;
  playerShape.y = y;
  //player data
  var player = {
    isComputer: false,
    shape: playerShape,
    hp: 100,
    velX: 0,
    velY: 0,
    grounded : false,
    legs : null,
    legMoveNum: 0,
    legMoveDir : false,
    color:null,
    sword: null,
    arm: null,
    swordColor: randomColor(),
    namePlate: null,
    state: 0,
    attackTimer: -attackCooldown,
    defendTimer: 0,
    hitbox: null,
    hitTimer: 0,
    healthBarInner: null
  };
  //building the player body
  var name = document.getElementById("name");
  var isComputer = document.getElementById("isComputer");
  player.isComputer = overrideButtons ? overrideIsComputer : isComputer.value;
  var brightness = overrideButtons ? (player.isComputer ? 50 : 240) : document.getElementById("brightness").value;
  var color = createjs.Graphics.getRGB(brightness, brightness, brightness, 1);
  player.color = color;
  //health bar
  var healthBar = new createjs.Shape();
  healthBar.alpha = .5;
  healthBar.graphics.beginFill("black").drawRect(-100,0,200,20);
  healthBar.y = - 127;
  playerShape.addChild(healthBar);

  var healthBarInner = new createjs.Shape();
  healthBarInner.graphics;
  healthBarInner.y = - 127;
  playerShape.addChild(healthBarInner);
  player.healthBarInner = healthBarInner;

  //nameplate
  if(name.value == "" || overrideButtons){
    name.value = player.isComputer ? "CPU" : "HMN";
  }
  var namePlate = new createjs.Text(name.value, "50px Arial", "white");
  namePlate.y = - 140;
  namePlate.textBaseline = "alphabetic";
  namePlate.x -= namePlate.getBounds().width /2;
  playerShape.addChild(namePlate);
  player.namePlate = namePlate;

  //body
  var head = new createjs.Shape();
  head.graphics.beginFill(color).drawCircle(0, 0, 100);
  playerShape.addChild(head);

  var body = new createjs.Shape();
  body.graphics.setStrokeStyle(20).beginStroke(color).moveTo(0, 100).lineTo(0, 250).endStroke();
  playerShape.addChild(body);

  var legs = new createjs.Shape();
  legs.graphics.setStrokeStyle(20).beginStroke(color).moveTo(0, 150).lineTo(-100,250).endStroke();
  playerShape.addChild(legs);
  player.legs = legs;

  var sword = new createjs.Shape();
  sword.graphics.setStrokeStyle(20).beginStroke(color).moveTo(0, 150).lineTo(50, 200).lineTo(75, 175)
  .setStrokeStyle(10).beginStroke(player.swordColor).moveTo(60, 160).lineTo(90, 190).moveTo(75, 175).lineTo(225,25).endStroke();
  playerShape.addChild(sword);
  player.sword = sword;

  var hitbox = new createjs.Shape();
  hitbox.alpha = 0;
  hitbox.graphics.beginFill("red").drawRect(-90,-60,180,450);
  playerShape.addChild(hitbox);
  hitbox.setBounds(-90,-60,180,450);
  player.hitbox = hitbox;

  //make the players face each other
  if(player.isComputer){
    player.shape.scaleX = -1;
    player.namePlate.scaleX = -1;
    player.namePlate.x *= -1;
  }

  //player model end
  players.push(player);
  stage.addChild(playerShape);
}

function registerSounds(){
  createjs.Sound.registerSound("sound/block.mp3", "block");
  createjs.Sound.registerSound("sound/hit.mp3", "hit");
  createjs.Sound.registerSound("sound/swing.mp3", "swing");
}
function playSound(soundID){
  if(soundEnabled){
    createjs.Sound.play(soundID);
  }
}
function toggleSound(){
  soundEnabled = !soundEnabled;
  var button = document.getElementById("soundToggle");
  button.innerHTML = soundEnabled ? "Disable Sound" : "Enable Sound";
}
