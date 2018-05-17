var walkSpeed = 1;
var legMoveNumLimit = 50;
var jump = 9;
var grav = .4;
var speedcap = 20;
var accel = 5;
var drag = .2;

var STATE_IDLE = 0;
var STATE_ATTACK = 1;
var STATE_DEFEND_1 = 2;
var STATE_DEFEND_2 = 3;

var attackLength = 15;
var attackSpeed = 20;
var attackCooldown  = 40;
var attackStrength = 25;

var defendLength = 20;
var defendCooldown = 40;

var hitCooldown = 30;

function updatePlayer(player){
  //check for input
  if(!player.isComputer){checkInputs(player);}
  if(player.isComputer){assignInputs(player);}
  //movement
  gravity(player);//needs to be first because this sets the grounded variable
  move(player);
  //attacking
  attack(player);
  defend(player);
  checkForHit(player);
  //cosmetic
  drawHealth(player);
  moveLegs(player);
}
//movement functions
function gravity(player){
  player.grounded = false;
  player.velY += grav;
  var testY = player.shape.x + player.velY;
  if(player.shape.y + 400 > ground.y){
    player.velY = 0;
    player.shape.y = ground.y - 400;
    player.grounded = true;
  }else{
    player.shape.y += player.velY;
  }
}
function move(player){
  player.shape.x += player.velX;
  player.shape.y += player.velY;
  //slow down by set amount and stop if below certain amount
  player.velX += (player.velX > 0) ? -drag : drag;
  if(Math.abs(player.velX) < .25)
  player.velX = 0;

  wrap(player);
}
function wrap(player){
  if(player.shape.x > canvas.width + 50){
    if(player.velX > 0){
      player.velX *= -1;
    }
    //player.shape.x = -49;
    player.shape.x = canvas.width + 49;
  }
  else if(player.shape.x < - 50){
    if(player.velX < 0){
      player.velX *= -1;
    }
    player.shape.x = -49
    //player.shape.x = canvas.width + 49;
  }
}
function input(player,direction){
  switch(direction){
    case DIRECTION_LEFT:
    player.shape.scaleX = -1;
    player.namePlate.scaleX = -1;
    if(player.namePlate.x < 0)
    player.namePlate.x *= -1;
    if(player.velX > -speedcap){
      player.velX -= accel;
    }
    break;
    case DIRECTION_RIGHT:
    player.shape.scaleX = 1;
    player.namePlate.scaleX = 1;
    if(player.namePlate.x > 0)
    player.namePlate.x *= -1;
    if(player.velX < speedcap){
      player.velX += accel;
    }
    break;
    case DIRECTION_UP:
    if(player.grounded){
      player.velY -= jump;
    }
    break;
    case DIRECTION_DOWN:
    player.defendTimer = defendLength;
    player.state = STATE_DEFEND_1;
    player.sword.y = 160;
    player.sword.x = -40;
    player.sword.regX = -25;
    player.sword.regY = 100;
    player.sword.rotation = -30;
    break;
  }
}
function attack(player){
  if(player.attackTimer >= -attackCooldown-2){
    player.attackTimer --;
  }
  if(player.state == STATE_ATTACK){
    if(player.attackTimer == attackLength-5){playSound("swing");}
    if(player.attackTimer < 0){
      player.state = STATE_IDLE;
      player.sword.graphics.clear();
      player.sword.graphics.setStrokeStyle(20).beginStroke(player.color).moveTo(0, 150).lineTo(50, 200).lineTo(75, 175)
      .setStrokeStyle(10).beginStroke(player.swordColor).moveTo(60, 160).lineTo(90, 190).moveTo(75, 175).lineTo(225,25).endStroke();
      player.sword.x = 0;
      player.sword.y = 0;
      player.sword.rotation = 0;
      player.sword.regX = 0;
      player.sword.regY = 0;
    }
  }
}
function defend(player){
  switch(player.state){
    case(STATE_DEFEND_1):
    player.defendTimer --;
    if(player.defendTimer < 0){
      player.state = STATE_DEFEND_2;
      player.sword.alpha = .5;
    }
    break;
    case(STATE_DEFEND_2):
    player.defendTimer --;
    if(player.defendTimer < -defendCooldown-2){
      player.state = STATE_IDLE;
      player.sword.x = 0;
      player.sword.y = 0;
      player.sword.rotation = 0;
      player.sword.regX = 0;
      player.sword.regY = 0;
      player.sword.alpha = 1;
    }
    break;
  }
}
function checkForHit(player){

  if(player.hitTimer > -1){player.hitTimer --;}

  players.forEach(function(other){
    lightBox.alpha = 0;
    if(other.hitTimer > hitCooldown - 3){lightBox.alpha += .5}
    if(player != other){
      var x = player.shape.x + 340 * player.shape.scaleX;
      var y = player.shape.y + 165;
      var point = other.hitbox.globalToLocal(x, y);
      if(other.hitbox.hitTest(point.x,point.y) && player.state == STATE_ATTACK && other.hitTimer < 0){
        evaluateHit(player,other);
      }
    }
  });
}
function evaluateHit(player,other){
  if(other.state == STATE_DEFEND_1){
    player.hp -= attackStrength/2;
    player.attackTimer = 0;
    playSound("block");
  }else{
    other.hp -= attackStrength;
    other.hitTimer = hitCooldown;
    other.velX = (player.velX + other.velX) / 2;
    playSound("hit");
  }
}
function drawHealth(player){
  player.healthBarInner.graphics.clear();
  if(player.hp > 0){
    player.healthBarInner.graphics.beginFill(player.swordColor).drawRect(-100 * player.shape.scaleX,0,player.hp*2* player.shape.scaleX,20);
  }else{
    stage.removeChild(player.shape);
    //do ml stuff here, before the player is destroyed
    players.pop(player);
  }
}
