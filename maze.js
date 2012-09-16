//creates a maze, unfortunately, no collision detection
var Maze = (function () {
	
	
	function Maze(data) {
		this.size=data.size;
	}
	
	
	Maze.prototype.draw = function() {
	    mvPushMatrix();
	    mat4.translate(mvMatrix, [0,-15,0]);
	    mat4.scale(mvMatrix, this.size);
	    drawMaze(brickTex);
	    mvPopMatrix();           
	}
	
	Maze.prototype.animate = function (elapsed) {
	
	}
	
	return Maze;
	
}());

//load maze from maze.txt
function loadMaze() {
	var request = new XMLHttpRequest();
	request.open("GET", "maze.txt");
	request.onreadystatechange = function() {
	  	if (request.readyState == 4) {
	    	handleLoadedMaze(request.responseText);
	  	}
	}
	request.send();
}

var mazeVertexPositionBuffer = null;
var mazeVertexTextureCoordBuffer = null;

//break up the text file, use it to assemble coord arrays, give those arrays to buffers
function handleLoadedMaze(data) {
	var lines = data.split("\n");
	var vertexCount = 0;
	var vertexPositions = [];
	var vertexTextureCoords = [];
	for (var i in lines) {
	var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
		if (vals.length == 5 && vals[0] != "//") {
			// It is a line describing a vertex; get X, Y and Z first
			vertexPositions.push(parseFloat(vals[0]));
			vertexPositions.push(parseFloat(vals[1]));
			vertexPositions.push(parseFloat(vals[2]));
			
			// And then the texture coords
			vertexTextureCoords.push(parseFloat(vals[3]));
			vertexTextureCoords.push(parseFloat(vals[4]));
			
			vertexCount += 1;
		}
	}
	
	mazeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
    mazeVertexPositionBuffer.itemSize = 3;
    mazeVertexPositionBuffer.numItems = vertexCount;

    mazeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
    mazeVertexTextureCoordBuffer.itemSize = 2;
    mazeVertexTextureCoordBuffer.numItems = vertexCount;
}

//using maze buffers, draw with given texture
function drawMaze(texture){
	    gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mazeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mazeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, mazeVertexPositionBuffer.numItems);

}