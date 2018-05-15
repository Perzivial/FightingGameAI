function moveLegs(player){
  if(player.legMoveDir){
    player.legMoveNum += walkSpeed * Math.abs(player.velX);
    if(player.legMoveNum > legMoveNumLimit){
      player.legMoveNum = legMoveNumLimit;
      player.legMoveDir = false;
    }
  }
  else{
    player.legMoveNum -= walkSpeed * Math.abs(player.velX);
    if(player.legMoveNum < -legMoveNumLimit){
      player.legMoveNum = -legMoveNumLimit;
      player.legMoveDir = true;
    }
  }
  player.legs.graphics.clear().setStrokeStyle(20).beginStroke(player.color).moveTo(0, 250).lineTo(50 - player.legMoveNum, 400).moveTo(0, 250).lineTo(-50 + player.legMoveNum, 400).endStroke();
}
