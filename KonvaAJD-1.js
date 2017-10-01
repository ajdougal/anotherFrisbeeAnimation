
var width = window.innerWidth;
var height = window.innerHeight;
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});
var layer = new Konva.Layer();
var players = [];
var fieldCopyNumber = 0;

function addBox(x, y, w, h, color, draggable, canClone, addToCounter){
  var box = new Konva.Rect({
    x: x,
    y: y,
    fill: color,
    stroke: "black",
    strokeWidth: 4,
    draggable: draggable,
    width: w,
    height: h
  });

  // makes object go to top of stacked objects when clicked
  box.on("dragstart", function() {
    this.moveToTop();
    layer.draw();
  });

  // when clicked mouse cursor is a pointer
  box.on("dragmove", function() {
    document.body.style.cursor = "pointer";
  });

         
  box.on("click", function() {
     if(canClone){
     addBox(150,30,w,h,color,"true",false,true);
   }
  });
  box.on("mouseover", function() {
      // document.body.style.cursor = "default";
      if(draggable){
        document.body.style.cursor = "pointer"
      }
  });
  box.on("mouseout", function() {
      // document.body.style.cursor = "default";
      if(draggable){
        document.body.style.cursor = "default"
      }
  });
  if(addToCounter){
    players.push(box);
  }
  layer.add(box);
  stage.add(layer);
}

function addBoxToCopyField(x, y, w, h, color){
  var box = new Konva.Rect({
    x: x,
    y: y,
    fill: color,
    stroke: "black",
    strokeWidth: 4,
    draggable: false,
    width: w,
    height: h
  });
         
  box.on("click", function() {
     fieldCopyNumber+=1;
     var x = 50 + (fieldCopyNumber%3)*250;
     var y = 20 + Math.floor(fieldCopyNumber/3)*600;
     addBox(x,y,200,550,"white",false,false);
     addBox(x,y,200,550,"white",false,false);
     addBox(x,y+100,200,350,"white",false,false);
     for(i=0;i<players.length;i++){
      var playerX = players[i].getAttr("x") + (fieldCopyNumber%3)*250;
      var playerY = players[i].getAttr("y") + Math.floor(fieldCopyNumber/3)*600;
      var playerW = players[i].getAttr("width");
      var playerH = players[i].getAttr("height");
      var playerColor = players[i].getAttr("fill");
      console.log(playerX,playerY,playerW,playerH,playerColor,false,false,false);
      addBox(playerX,playerY,playerW,playerH,playerColor,false,false,false);
     }
  });
  box.on("mouseover", function() {
    document.body.style.cursor = "pointer"
  });
  box.on("mouseout", function() {
    document.body.style.cursor = "default"
  });
  layer.add(box);
  stage.add(layer);
}
addBox(20,20,15,15,"red",false,true,false);
addBox(20,50,15,15,"blue",false,true,false);
addBox(50,20,200,550,"white",false,false,false);
addBox(50,120,200,350,"white",false,false,false);
addBoxToCopyField(20,80,15,15,"grey");
// add the layer to the stage
stage.add(layer);