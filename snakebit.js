function SnakeBit(data) {

	this.position=data.position;
	this.front = data.front;
}


SnakeBit.prototype.draw = function/* snakeDraw*/() {
    mvPushMatrix();
    mat4.translate(mvMatrix, this.position);
    drawCube(snakeTex);
    mvPopMatrix();           
}


SnakeBit.prototype.animate = function/* snakeAnimate*/(elapsed){
	//if head hits snake
	if(hasCollided(head.position,this.position,1)){
		gameOver=true;
	}
	var difference = vec3.create();
	//move towards the snakebit in front of you 
	vec3.subtract(this.front.position, this.position, difference);
	//maintain distance
	if (!hasCollided(this.front.position, this.position, 2)){
		vec3.scale(difference, (elapsed*speed*0.3));
		vec3.add(this.position, difference);
	}
	
}