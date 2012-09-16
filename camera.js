//cameraType enum
cameraType = {
	FREE : 0,
	ORBIT : 1,
	FOLLOW : 2,
	FIXED : 3
	
}

var eye = vec3.create();


//Sets camera movement
function chooseCamera(camera){
	//init
	mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    
    //Free camera movement
	if (camera == cameraType.FREE){
		mat4.rotate(mvMatrix, -pitch, [1, 0, 0]);
		mat4.rotate(mvMatrix, -yaw, [0, 1, 0]);
		mat4.translate(mvMatrix,[xTrans, 0, zTrans]);
	//Orbit	
	}else if (camera == cameraType.ORBIT){
		degree+=0.01;
		mat4.lookAt([Math.sin(degree) * 29,Math.cos(degree) * 29, -29], head.position, [0,1,0], mvMatrix);
	
	//follow behind
	} else if (camera == cameraType.FOLLOW){
		
		//make eye 5 behind position in the direction your heading in
		vec3.set(vec3.scale(vec3.create(head.direction),-5), eye);
		vec3.add(eye,head.position);
		
		//move eye above snake if travelling in x,z or off to the side if y
		if(head.direction[1]==0){
			vec3.add(eye, [0,2,0]);
		}else{
			vec3.add(eye, [0,0,2]);
		}
		
		mat4.lookAt(eye, head.position, [0,1,0], mvMatrix);
		
	} else if (camera == cameraType.FIXED){
		mat4.lookAt([0,0,-29], head.position, [0,1,0], mvMatrix);
	}
    
	
	
	
}