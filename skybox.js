//creates a cube with a given texture, at a given size
var Skybox = (function () {
	
	function Skybox(data) {
		this.size=data.size;
	}
	
	
	Skybox.prototype.draw = function() {
	    mvPushMatrix();
	    mat4.scale(mvMatrix, this.size);
	    drawCube(floorTex);
	    mvPopMatrix();           
	}
	
	Skybox.prototype.animate = function (elapsed) {
	
	}
	
	return Skybox;
	
}());