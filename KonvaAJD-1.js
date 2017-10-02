var width = window.innerWidth;
var height = window.innerHeight;
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});
var layer = new Konva.Layer();
var players = [];
var loopPlayers = [];
var fieldCopyNumber = 0;
var timer = 60;
var globalStartTime;
var globalCurrentTime;
var recordingData = [];
var recordingId;
var playbackId;

var loopPlayerBoxes = [];

var recordingTimeInterval = 100;
var playbackTimeInterval = 80;

function addBox(x, y, w, h, color, draggable, canClone, addToCounter, loopBox){
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
    if(loopBox){
        loopPlayerBoxes.push(box);
    }
    layer.add(box);
    stage.add(layer);
}

function addRecordingBox(x,y,w,h,color){
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
        var realTimeMillisecondsStart = new Date().getTime();
        recordingData = [];
        var realTimeMillisecondsCurrent = new Date().getTime();
        timer = 0;
        recordingId = setInterval(function(){
            for(var ij = 0; ij<players.length;ij++){
                var ijX = players[ij].getAttr("x");
                var ijY = players[ij].getAttr("y");
                var ijColor = players[ij].getAttr("fill");
                var timestampIj = new Timestamp(ijX,ijY,ijColor,timer);
                recordingData.push(timestampIj);
            }
            realTimeMillisecondsCurrent = new Date().getTime();
            timer = realTimeMillisecondsCurrent - realTimeMillisecondsStart;
            if (timer > 3000) {
                clearInterval(recordingId);
            }
            console.log(recordingData);
        }, recordingTimeInterval);
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

function Timestamp(x,y,color,minTime){
    this.x = x;
    this.y = y;
    this.color = color;
    this.minTime = minTime;
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
        addBox(x,y,200,550,"white",false,false,false,false);
        addBox(x,y,200,550,"white",false,false,false,false);
        addBox(x,y+100,200,350,"white",false,false,false,false);
        for(var i=0;i<players.length;i++){
            var playerX = players[i].getAttr("x") + (fieldCopyNumber%3)*250;
            var playerY = players[i].getAttr("y") + Math.floor(fieldCopyNumber/3)*600;
            var playerW = players[i].getAttr("width");
            var playerH = players[i].getAttr("height");
            var playerColor = players[i].getAttr("fill");
            addBox(playerX,playerY,playerW,playerH,playerColor,false,false,false,false);
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

function destroyAllLoopPlayers(){
    for (var k = 0; k<loopPlayerBoxes.length;k++){
        loopPlayerBoxes[k].destroy();
    }
}

function updateLoopPlayersModel(){
    loopPlayers = [];
    globalCurrentTime = new Date().getTime();
    timer = globalCurrentTime - globalStartTime;
    for (var increment = 0; increment<recordingData.length; increment++){
        if(Math.abs(timer - recordingData[increment].minTime) <= playbackTimeInterval/2){
            loopPlayers.push(recordingData[increment]);
        }
    }
    destroyAllLoopPlayers();
    createAllLoopPlayers();
    if (timer > 10000){
        clearInterval(playbackId);
        console.log("Killed playback");
    }
}

function addPlaybackBox(x,y,w,h,color){
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
        globalStartTime = new Date().getTime();
        globalCurrentTime = globalStartTime;
        timer = globalCurrentTime - globalStartTime;
        addBox(300,20,200,550,"white",false,false,false,false);
        addBox(300,120,200,350,"white",false,false,false,false);
        playbackId = setInterval(updateLoopPlayersModel, playbackTimeInterval-5);
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

function createAllLoopPlayers(){
    loopPlayerBoxes = [];
    for (var l = 0; l<loopPlayers.length;l++){
        console.log(loopPlayers[l]);
        var x = loopPlayers[l].x + 250;
        var y = loopPlayers[l].y;
        var w = 15;
        var h = 15;
        var color = loopPlayers[l].color;
        addBox(x,y,w,h,color,false,false,false,true);
    }
}
addBox(20,20,15,15,"red",false,true,false,false);
addBox(20,50,15,15,"blue",false,true,false,false);
addBox(50,20,200,550,"white",false,false,false,false);
addBox(50,120,200,350,"white",false,false,false,false);
addBoxToCopyField(20,80,15,15,"grey");
addRecordingBox(20,110,15,15,"pink");
addPlaybackBox(20,140,15,15,"green");
// add the layer to the stage
stage.add(layer);