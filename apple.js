var Apple = (function () {
	
	
	function Apple(data) {
		this.position = data.position;
		this.score = 10;
		this.rotation = 0;
		this.bounceAngle = 0;
		
		
	}
	
	Apple.prototype.draw = function() {
	    mvPushMatrix();
	    
	    //draw in its position, with its rotation, at the appropriate scale
	    mat4.translate(mvMatrix, this.position);
	    mat4.rotate(mvMatrix, this.rotation, [0,1,0]);
	    mat4.scale(mvMatrix, [0.15,0.15,0.15]);
	    
	    
	    drawApple(teapotTex);
	    mvPopMatrix();  
	}
	
	Apple.prototype.animate = function (elapsed) {
		
		//add a bounce and a spin
		this.bounceAngle += elapsed*speed;
		this.rotation += elapsed;
		vec3.add(this.position, [0,Math.sin(this.bounceAngle)/5,0]);
		
		//if snake eats apple
		if (hasCollided(head.position,this.position, 2)){
			
			//move to new place, update score, add to snake
			this.position = vec3.create([27 - Math.random()*54,27 - Math.random()*54,27 - Math.random()*54]);
			score += this.score;
			updateScore();
			addToConsole("TEAPOT GET!");
			addToSnake();
			speed++;
					
		}
		
	}
	return Apple;
	
}());


var teapotVertexPositionBuffer;
var teapotVertexTextureCoordBuffer;
var teapotVertexIndexBuffer;

//create buffers from the teapot JSON data
function handleLoadedTeapot(teapotData) {

    teapotVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
    teapotVertexTextureCoordBuffer.itemSize = 2;
    teapotVertexTextureCoordBuffer.numItems = teapotData.vertexTextureCoords.length / 2;

    teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize = 3;
    teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length / 3;

    teapotVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize = 1;
    teapotVertexIndexBuffer.numItems = teapotData.indices.length;

  
}
//load teapot
function loadTeapot() {
    var request = new XMLHttpRequest();
    request.open("GET", "teapot.json");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            handleLoadedTeapot(JSON.parse(request.responseText));
        }
    }
    request.send();
}

//with the given texture, draw Teapot
function drawApple(texture){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}