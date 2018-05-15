var walkSpeed = 1;
var legMoveNumLimit = 50;

function updatePlayer(player){
  moveLegs(player);
}
function gravity(player){

}
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
  player.legs.graphics.clear().setStrokeStyle(20).beginStroke("LightGrey").moveTo(0, 250).lineTo(50 - player.legMoveNum, 400).moveTo(0, 250).lineTo(-50 + player.legMoveNum, 400).endStroke();
}
function move(player){
  player.shape.x += player.velX;
  player.shape.y += player.velY;
}
