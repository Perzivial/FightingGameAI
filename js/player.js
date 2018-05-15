var walkSpeed = 1;
var legMoveNumLimit = 50;
var grav = .2;

//cosmetic functions
function moveLegs(player){
  if(player.legMoveDir){
    player.legMoveNum += walkSpeed * player.velX;
    if(player.legMoveNum > legMoveNumLimit){
      player.legMoveNum = legMoveNumLimit;
      player.legMoveDir = false;
    }
  }
  else{
    player.legMoveNum -= walkSpeed * player.velX;
    if(player.legMoveNum < -legMoveNumLimit){
      player.legMoveNum = -legMoveNumLimit;
      player.legMoveDir = true;
    }
  }
  player.legs.graphics.clear().setStrokeStyle(20).beginStroke(player.color).moveTo(0, 250).lineTo(50 - player.legMoveNum, 400).moveTo(0, 250).lineTo(-50 + player.legMoveNum, 400).endStroke();
}

function updatePlayer(player){
  //movement
  gravity(player);//needs to be first because this sets the grounded variable

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
}
