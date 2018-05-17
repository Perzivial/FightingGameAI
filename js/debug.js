function toggleHitboxes(){
  players.forEach(function(player){
    player.hitbox.alpha = (player.hitbox.alpha == 0) ? .5 : 0;
  });
}
function getAiData(){
  if(players.length == 2){
  var player = players[0];
  var cpu = players[1];
  var keyDownEventData = {
    //list of values
    dist: Math.abs(player.shape.x - cpu.shape.x),
    toTheRight: cpu.shape.x > player.shape.x
  };
}
}
