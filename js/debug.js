function toggleHitboxes(){
  players.forEach(function(player){
    player.hitbox.alpha = (player.hitbox.alpha == 0) ? .5 : 0;
  });
}
