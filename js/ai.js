var recordedKeyDownEvents = [];
function recordEventKeyDown(event){

}

function removeJsonLink(){
  var container = document.getElementById("container");
  container.innerHTML = "";
}

function downloadKeyEvents(){
  removeJsonLink();
  var obj = {a: 123, b: "4 5 6"};
  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

  $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');
}
