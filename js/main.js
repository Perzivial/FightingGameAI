function init() {
    var canvas = document.getElementById("canvas");
    canvas.width  = (window.innerWidth*.7)*2;
    canvas.height = (window.innerHeight*.7)*2;
    canvas.style.width = (canvas.width / 2) + "px";
    canvas.style.height = (canvas.height / 2) + "px";

    var stage = new createjs.Stage("canvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("LightGrey").drawCircle(0, 0, 100);
    circle.x = 200;
    circle.y = 200;
    stage.addChild(circle);
    stage.update();
  }
