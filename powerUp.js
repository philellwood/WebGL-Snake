//powers enum
powerUpType = {
	SLOW : 0,
	HALF : 1,
	CRUISE : 2
}

var cruiseControl=false;
var t = null;

var PowerUp = (function () {
	
	function PowerUp(data) {
		this.position = data.position;
		this.score = 100;
		this.type = pickPower();
		this.rotation = 0;
		
		this.hide = hide;
		this.show = show;
		this.endCruise = endCruise;
		
	}
	
	PowerUp.prototype.draw = function() {
	    mvPushMatrix();
	    mat4.translate(mvMatrix, this.position);
	    mat4.rotate(mvMatrix, this.rotation, [1,1,0.5]);	    
	    drawCube(crateTex);
	    mvPopMatrix();  
	}
	
	PowerUp.prototype.animate = function (elapsed) {
	
		//spin the crate
		this.rotation += elapsed;
		
		//if snake gets powerup
		if (hasCollided(head.position,this.position, 2)){
			score += this.score;
			updateScore();
			this.hide();
			addToConsole("powerUp:");
			
			//handle the powerup
			switch(this.type){
				
				case powerUpType.SLOW:
					speed = speed*0.75;
					addToConsole("SNAKE SLOWED");
					break;
				case powerUpType.HALF:
					var i = snake.length/2;
					while(i>=1){
						snake.pop();
						i--;
					}
					addToConsole("SNAKE HALVED");
					break;
					
				case powerUpType.CRUISE:
					cruise();
					addToConsole("CRUISE CONTROL");
					break;
					
				default:
					console.log(this.type);
			
			}
		}
		
	}
	
	//takes crate off screen for 10s
	function hide(){
		this.position = vec3.create([40,40,40]);
		if(t==null){
			t = setTimeout("powerUp.show()", 10000);
		}
		
	}
	
	//moves to new place, with a new power
	function show(){
		//move to a new random position
		this.position = vec3.create([28 - Math.random()*56,28 - Math.random()*56,28 - Math.random()*56]);
		this.type = pickPower();
		t = setTimeout("powerUp.hide()", 10000);
		t = null;
	}
	
	//sets cruise to true (effects head.animate)
	function cruise(){
		cruiseControl = true;
		setTimeout("powerUp.endCruise()", 5000);
	}
	
	//ends cruise
	function endCruise(){
			cruiseControl = false;
			addToConsole("CRUISE CONTROL OVER");	
	}
	
	//return a random power
	function pickPower(){
		var i = Math.floor(Math.random()*Object.keys(powerUpType).length);
		switch (i){
			case 0:
				return powerUpType.SLOW;
				break;
			case 1:
				return powerUpType.HALF;
				break;
				
			case 2:
				return powerUpType.CRUISE;
				break;
				
			default:
				console.log(i);
				break;
		
		}
				
	}
	return PowerUp;
	
}());

