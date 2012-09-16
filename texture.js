var snakeTex;
var crateTex;
var teapotTex;
var floorTex;
var brickTex;

//gets textures from image, turns it into a gl texture
function initTexture(){
    
    var snakeImage = new Image();
    var texture = gl.createTexture();
    texture.image = snakeImage;
    snakeTex = texture;
    snakeImage.onload = function () {
        handleLoadedTexture(snakeTex)
    }
    snakeImage.src = "snake.jpg";
    
    var crateImage = new Image();
    var texture1 = gl.createTexture();
    texture1.image = crateImage;
    crateTex = texture1;
    crateImage.onload = function () {
        handleLoadedTexture(crateTex)
    }
    crateImage.src = "crate.gif";
    
    var brickImage = new Image();
    var texture2 = gl.createTexture();
    texture2.image = brickImage;
    brickTex = texture2;
    brickImage.onload = function () {
        handleLoadedTexture(brickTex)
    }
    brickImage.src = "brick.gif";
    
    var floorImage = new Image();
    var texture3 = gl.createTexture();
    texture3.image = floorImage;
    floorTex = texture3;
    floorImage.onload = function () {
        handleLoadedTexture(floorTex)
    }
    floorImage.src = "floor.gif";
    
    var teapotImage = new Image();
    var texture3 = gl.createTexture();
    texture3.image = teapotImage;
    teapotTex = texture3;
    teapotImage.onload = function () {
        handleLoadedTexture(teapotTex)
    }
    teapotImage.src = "teapot.jpg";
}

//flip the co-ords
function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	//binds texture to gl, handles it, then unbinds
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
}