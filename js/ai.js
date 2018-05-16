var recordedKeyDownEvents = [];
var record = false;
function recordEventKeyDown(event){
  //assumes that there are only two players
  var player = players[0];
  var cpu = players[1];
  var keyDownEventData = {
    //list of values
    dist: player.shape.x - cpu.shape.x,
    playerY: player.shape.y,
    cpuY: cpu.shape.y,
    playerState: player.state,
    cpuState: cpu.state,
    //the label
    eventKeyCode: event.KeyCode
  };
  recordedKeyDownEvents.push(keyDownEventData);
}
function toggleRecord(){
  record = !record;
  var button = document.getElementById("recordToggle");
  button.innerHTML = record ? "Stop Recording" : "Start Recording";
}
function removeJsonLink(){
  var container = document.getElementById("jsonData");
  container.value = "";
}
function copyKeyEvents(){
  var jsonData = document.getElementById("jsonData").value;
  recordedKeyDownEvents = JSON.parse(jsonData);
}
function downloadKeyEvents(){
  var data = JSON.stringify(recordedKeyDownEvents);
  var jsonData = document.getElementById("jsonData");
  jsonData.value = data;
}
