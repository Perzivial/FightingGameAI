function checkInputs(player){
  if (Key.isDown(Key.RIGHT)){
    input(player,DIRECTION_RIGHT);
  }
  if (Key.isDown(Key.LEFT)) {
    input(player,DIRECTION_LEFT);
  }
  if (Key.isDown(Key.UP)) {
    input(player,DIRECTION_UP);
  }
  if (Key.isDown(Key.DOWN) && player.state == STATE_IDLE) {
    input(player,DIRECTION_DOWN);
  }
  if (Key.isDown(Key.Q) && player.state == STATE_IDLE && player.attackTimer < -attackCooldown) {
    player.state = STATE_ATTACK;
    player.attackTimer = attackLength;
    //make the sword swing (make arm longer and move pivot point)
    player.sword.graphics.clear();

    player.sword.graphics.setStrokeStyle(20).beginStroke(player.color).moveTo(-40, 250).lineTo(75, 175)
    .setStrokeStyle(10).beginStroke(player.swordColor).moveTo(60, 160).lineTo(90, 190).moveTo(75, 175).lineTo(225,25).endStroke();
    player.sword.y = 40;
    player.sword.x = 120;
    player.sword.regX = -25;
    player.sword.regY = 100;
    //rotate down
    player.sword.rotation = 45;
    player.velX += attackSpeed * player.shape.scaleX;
    createjs.Sound.play("swing");
  }
}
