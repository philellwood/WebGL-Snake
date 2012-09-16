var Head = (function () {
	
	function Head(data) {
		this.position = data.position;
		this.direction = data.direction;
	}
	
	Head.prototype = new SnakeBit({id:null, position:null, front:null});
	
	Head.prototype.draw = function() {
	    mvPushMatrix();
	    mat4.translate(mvMatrix, this.position);
	    drawCube(snakeTex);
	    mvPopMatrix();           
	}
	
	Head.prototype.animate = function (elapsed) {
		
		//lerp is the linear interpolation amount
		var lerp = speed*elapsed;
		var newPosition = vec3.create();
		
		if(cruiseControl){
			//move towards apple
			vec3.lerp(this.position, apple.position, lerp*0.1);
		}else{
			//move in direction
			vec3.add(this.position,this.direction, newPosition);
			vec3.lerp(this.position, newPosition, lerp);
		}
		
		//if goes out of the skybox
		for (var i=0; i<3; i++){
			if(this.position[i]>30 || this.position[i]<-30){
				gameOver = true;
			}
		}
		
	}
	
	return Head;
	
}());

