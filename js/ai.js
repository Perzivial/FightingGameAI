var recordedKeyDownEvents = [];
var record = false;
var autoLearn = false;

function recordEventKeyDown(event){
  if(players.length == 2){
    //assumes that there are only two players
    var player = players[0];
    var cpu = players[1];
    var keyDownEventData = {
      //list of values
      dist: Math.floor(Math.abs(player.shape.x - cpu.shape.x)),
      toTheRight: cpu.shape.x > player.shape.x,
      velX: player.velX,
      //the label
      eventKeyCode: event.keyCode
    };
    recordedKeyDownEvents.push(keyDownEventData);
  }
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

function splitArray(arr){
  var arrs = [];
  var middle = Math.floor((arr.length/2));
  arrs.push(arr.slice(0,middle));
  arrs.push(arr.slice(middle,arr.length-1));
  return arrs;
}
function evaluateEffectiveness(labels, results){
  var score = 0;
  for(var i = 0;i < labels.length; i ++){
    if(labels[i] == results[i]){
      score ++;
    }
  }
  return (score/labels.length) * 100;
}

function toggleAutoLearn(){
  autoLearn = !autoLearn;
  document.getElementById("autoLearnToggle").innerHTML = autoLearn ? "Turn off auto learn" : "Turn on auto learn";
}

//actual ml stuff
var fnn = new ML.FNN();
var data;
var labels;
var splitData;
var splitLabels;
function runClassifier(){
  if(recordedKeyDownEvents.length > 0){
    data = [];
    labels = [];
    recordedKeyDownEvents.forEach(function(evt){
      var arr = [];
      arr.push(Math.floor(evt.dist));
      arr.push(Math.floor(evt.toTheRight));
      arr.push(evt.velX);
      data.push(arr);
      labels.push(evt.eventKeyCode);
    });

    splitData = splitArray(data);
    splitLabels = splitArray(labels);
    fnn.train(splitData[0],splitLabels[0]);
  }
}
function averageAccuracy(){
  var effectMean = 0;

  for(var i = 0; i < 10; i ++){
    fnn.train(splitData[0],splitLabels[0]);
    var results = fnn.predict(splitData[1]);
    var effect = evaluateEffectiveness(splitLabels[1],results);
    effectMean += effect;
  }
  effectMean /= 10;

  var effectRound = Math.round(effectMean * 100) / 100;
  document.getElementById("effect").innerHTML = effectRound + "%";
}
function predict(features) {
  features = ML.Matrix.checkMatrix(features);
  var outputs = [];
  var probabilities = fnn.propagate(features);
  var keys = fnn.dicts.outputs;
  for (var i = 0; i < probabilities[0].length; ++i) {
    outputs.push({
      chance:probabilities[0][i],
      key:keys[i]
    });
  }

  return outputs;
}
function assignInputs(player){
  if(players.length == 2 && fnn.model !== undefined){
    var data = [];
    var arr = [];
    arr.push(Math.floor(players[1].shape.x - players[0].shape.x));
    arr.push(Math.abs(players[1].shape.x > players[0].shape.x));
    arr.push(players[1].velX);
    data.push(arr);
    //assuming there's only one cpu
    var results = predict(data);

    results.forEach(function(result){

      if(result.chance > .3){
        if (result.key == Key.RIGHT){
          input(player,DIRECTION_RIGHT);
        }
        if (result.key == Key.LEFT) {
          input(player,DIRECTION_LEFT);
        }
        if (result.key == Key.UP) {
          input(player,DIRECTION_UP);
        }
        if (result.key == Key.DOWN && player.state == STATE_IDLE) {
          input(player,DIRECTION_DOWN);
        }
        if (result.key == Key.Q && player.state == STATE_IDLE && player.attackTimer < -attackCooldown) {
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

        }
      }
    });
  }
}
function downloadModel(){
  var jsonData = JSON.stringify(fnn);
  document.getElementById("jsonData").value = jsonData;
}
function uploadModel(){
  var jsonData = document.getElementById("jsonData").value;
  model = JSON.parse(jsonData);
  fnn = ML.FNN.load(model);
}
