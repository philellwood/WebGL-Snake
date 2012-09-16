//checks 2 vectors to see if they are closer than a set tolerantce
function hasCollided(pos1,pos2, tolerance){
	var difference = vec3.create();
	
	vec3.subtract(pos1, pos2, difference);
	return (vec3.length(difference)<tolerance);
	
}

//check if score > highScore, update score
function updateScore(){
	if(score>highScore){
		highScore = score;
		$("#highScore").text("High Score: "+score);
	}
	$("#score").text(score);
}

function addToConsole(string){
	$("#console").append('<p>'+string+'</p>');
}

//create new Snakebit, assign its "front" to the last snakebit
function addToSnake(){
	var frontPosition = vec3.create(snake[snake.length-1].position);
	
	var newSnakeBit = new SnakeBit({
				position : frontPosition,
				front : snake[snake.length-1]
			});
	
	snake.push(newSnakeBit);
}