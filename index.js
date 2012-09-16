var gl;
var speed = 10;
var direction = vec3.create([0, 1, 0]);

//initialise
function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders()
    initBuffers();
    initTexture();
    loadMaze();
    loadTeapot();
    initGameObjects();
    

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	

    tick();
}
		    			
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var head, skybox, apple, powerUp, maze, gameOver, camera, paused, score, highScore, initSnakeBits, degree;
var gameObjects = [];
var snake = [];

//creates gameObjects, adds them to gameObjects Array
function initGameObjects(){
	initSnakeBits = 4;
	degree = 0;
	score = 0;
	highScore = 0;
	updateScore();

	camera = cameraType.FIXED;
	gameOver = false;
	paused = false;
	

	maze = new Maze({
		size : vec3.create([5,5,5])
	});
	gameObjects.push(maze);

	
	skybox = new Skybox({
		size : vec3.create([30,30,30])
	})
	gameObjects.push(skybox);
	
	powerUp = new PowerUp({
		position : vec3.create([28 - Math.random()*56,28 - Math.random()*56,0])
	});
	gameObjects.push(powerUp);
	
	for (var t in powerUpType){
		console.log(t);
	}
	
	head = new Head({
		position : vec3.create(),
		direction : direction
	});
	snake.push(head);
	
	apple = new Apple({
		position : vec3.create([28 - Math.random()*56,28 - Math.random()*56,28 - Math.random()*56])
		
	});
	gameObjects.push(apple);
	
	snake.push(new SnakeBit({
		position: vec3.create([0,-5,0]),
		front: head
	}));
	for (var i = 1; i<=initSnakeBits; i++){
		addToSnake();
	}
	
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

//using the cube buffer, draw a cube with the given texture
function drawCube(texture){
	//Setup texture and shaders
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//Draw on the screen
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //dont draw if maze not loaded
    if (mazeVertexTextureCoordBuffer == null || mazeVertexPositionBuffer == null) {
      return;
    }
    
    //move camera to correct position
	chooseCamera(camera);
	
	//draw snake and gameObjects
	for (var i in snake){
		snake[i].draw();
	}
	for (var i in gameObjects) {
		gameObjects[i].draw();
	}
    
}

var lastTime = 0;

//moves gmaeObjects to the right position
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
     	var elapsed = (timeNow - lastTime)/1000;
     	for (var i in snake){
			snake[i].animate(elapsed);
		}
       	for (var i in gameObjects) {
       		
			gameObjects[i].animate(elapsed);
		}
    }
    lastTime = timeNow;
}

//called every time screen wants us to draw
function tick() {
	//if game isn't over, animate and draw
	if(!gameOver){
    	requestAnimationFrame(tick);
    	handleKeys();
    	//if game is paused, don't animate
    	if (!paused){
    		animate();
    	}
    	drawScene();
    	
    //if game over
	}else{
		//update score
		highScore = score;
		score = 0;
		updateScore();
		
		addToConsole("DEAD!");
		//reset speed
		speed = 10;
		//shorten snake
		var i = snake.length-1;
		while(i>=1){
			snake.pop();
			i--;
		}
		//reset head
		vec3.set([0,0,0],head.position);
		snake.push(new SnakeBit({
			position: vec3.create([0,-5,5]),
			front: head
		}));
		gameOver = false;
		requestAnimationFrame(tick);
	}
}

