var walkSpeed = 1;
var legMoveNumLimit = 50;
var grav = .2;
var speedcap = 20;
var accel = .5;
var drag = .2;

function updatePlayer(player){
  //check for input
  if(!player.isComputer){checkInputs(player);}
  //movement
  gravity(player);//needs to be first because this sets the grounded variable
  move(player);
  //cosmetic
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
}
function input(player,direction){
  switch(direction){
    case DIRECTION_LEFT:
      if(player.velX > -speedcap){
        player.velX -= accel;
      }
    break;
    case DIRECTION_RIGHT:
      if(player.velX < speedcap){
        player.velX += accel;
      }
    break;
    case DIRECTION_UP:

    break;
    case DIRECTION_DOWN:

    break;
  }
}
