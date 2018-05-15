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
  if (Key.isDown(Key.DOWN)) {
    input(player,DIRECTION_DOWN);
  }
}
