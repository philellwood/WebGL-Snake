var zTrans = 0;
var xTrans = 0;

var currentlyPressedKeys = {};

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var yaw = 0;
var pitch = 0;

//handle mouse moving
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown) {
	  return;
	}
	var newX = event.clientX;
	var newY = event.clientY;
	
	yaw += (newX - lastMouseX)/180;
	
	pitch += (newY - lastMouseY)/180;
	
	lastMouseX = newX
	lastMouseY = newY;
}

//check if key is pressed
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;

}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	//movement (only move in that direction if not going the other way)
    if (currentlyPressedKeys[65] && head.direction[0]!=-1) {
      // A 
      
      vec3.set([1,0,0], head.direction);
    }
    if (currentlyPressedKeys[68] && head.direction[0]!=1) {
      // D 
      vec3.set([-1,0,0], head.direction);
    }
    if (currentlyPressedKeys[87] && head.direction[1]!=-1) {
      // W 
      vec3.set([0,1,0], head.direction);
    }
    if (currentlyPressedKeys[83] && head.direction[1]!=1) {
      // S 
      vec3.set([0,-1,0], head.direction);
    }
    
    if (currentlyPressedKeys[82] && head.direction[2]!=-1) {
      // R
      vec3.set([0,0,1], head.direction);
    }
    if (currentlyPressedKeys[70] && head.direction[2]!=1) {
      // F
      vec3.set([0,0,-1], head.direction);
    }
    
    //camera
    if (currentlyPressedKeys[49]) {
      //1
      camera = cameraType.FREE;
    }
    if (currentlyPressedKeys[50]) {
      //2
      camera = cameraType.ORBIT;
    }
    if (currentlyPressedKeys[51]) {
      //3
      camera = cameraType.FOLLOW;
    }
    if (currentlyPressedKeys[52]) {
      //4
      camera = cameraType.FIXED;
    }
    if (currentlyPressedKeys[37]) {
      //Left cursor key 
      xTrans -= 1;
    }
    if (currentlyPressedKeys[39]) {
      // Right cursor key 
      xTrans += 1;
    }
    if (currentlyPressedKeys[38]) {
      // up cursor key 
      zTrans += 1;
    }
    if (currentlyPressedKeys[40]) {
      // down cursor key 
      zTrans -= 1;
    }
    
    //pause
    if (currentlyPressedKeys[32]) {
      //space
      paused=true;
    }
    if (!currentlyPressedKeys[32]){
    	paused = false;
    }
}