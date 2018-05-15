var canvas;
var stage;
var players = [];
var ground;

function handleTick(event) {
  if (!event.paused) {
    players.forEach(function(player){
      updatePlayer(player);
    });
  }
  stage.update();
}

function init() {
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
    color:null
  };

  var name = document.getElementById("name");
  var isComputer = document.getElementById("isComputer");
  player.isComputer = overrideButtons ? overrideIsComputer : isComputer.value;
  var brightness = overrideButtons ? (player.isComputer ? 50 : 240) : document.getElementById("brightness").value;
  var color = createjs.Graphics.getRGB(brightness, brightness, brightness, 1);
  player.color = color;
  //player model start

  //nameplate
  if(name.value == "" || overrideButtons){
    name.value = player.isComputer ? "CPU" : "HMN";
  }
  var namePlate = new createjs.Text(name.value, "50px Arial", "white");
  namePlate.y = - 120;
  namePlate.textBaseline = "alphabetic";
  namePlate.x -= namePlate.getBounds().width /2;
  playerShape.addChild(namePlate);

  //body
  var head = new createjs.Shape();
  head.graphics.beginFill(color).drawCircle(0, 0, 100);
  playerShape.addChild(head);

  var body = new createjs.Shape();
  body.graphics.setStrokeStyle(20).beginStroke(color).moveTo(0, 100).lineTo(0, 250).endStroke();
  playerShape.addChild(body);

  var legs = new createjs.Shape();
  legs.graphics.setStrokeStyle(20).beginStroke(color).moveTo(0, 250).lineTo(50, 400).moveTo(0, 250).lineTo(-50, 400).endStroke();
  playerShape.addChild(legs);
  player.legs = legs;

  //player model end
  players.push(player);
  stage.addChild(playerShape);
}
