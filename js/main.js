var canvas;
var stage;
var players = [];
var ground;

var tkr = new Object;

function handleTick(event) {
    if (!event.paused) {

    }
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width  = (window.innerWidth*.7)*2;
    canvas.height = (window.innerHeight)*2;
    canvas.style.width = (canvas.width / 2) + "px";
    canvas.style.height = (canvas.height / 2) + "px";

    stage = new createjs.Stage("canvas");
    addGround();
    addPlayer(200,200);
    addPlayer(500,200);

    createjs.Ticker.addEventListener("tick", handleTick);

    stage.update();
}

function addGround(){
  ground = new createjs.Shape();
  ground.graphics.beginFill("grey").drawRect(0,(canvas.height/5)*4,canvas.width, (canvas.height/5));
  stage.addChild(ground);
}

function addPlayer(x , y){

  var playerShape = new createjs.Container();

  playerShape.x = x;
  playerShape.y = y;

  var player = {
    shape: playerShape,
    hp: 100,
    velX: 0,
    velY: 0
  };

  var circle = new createjs.Shape();
  circle.graphics.beginFill("LightGrey").drawCircle(0, 0, 100);

  playerShape.addChild(circle);
  players.push(player);

  stage.addChild(playerShape);
}
