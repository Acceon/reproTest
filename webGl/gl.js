
var testGl = {
	'cv': document.getElementById('canvas'),
	'gl': null,
	'aspect': null,
	'vertices': null,
	'vertexCode': document.getElementById('vertex').firstChild.nodeValue,
	'fragmentCode': document.getElementById('fragment').firstChild.nodeValue,

	'init': function(){
		var t = this;

		// Get web gl context
		t.gl = t.cv.getContext('webgl') || t.cv.getContext('experimental-webgl');
		if(typeof(t.gl) !== 'object'){
			console.log('Browser does not support webgl');
			return;
		}

		// Get the canvas aspect ratio (for calculating layout of elements later on)
		t.aspect = t.cv.width / t.cv.height;

		// Set the drawable area (entrie canvas)
		t.gl.viewport(0, 0, t.cv.width, t.cv.height);
		t.gl.clearColor(0, 0, 0, 1);
		t.gl.clear(t.gl.COLOR_BUFFER_BIT);

		t.compileShaders();
	},

	'compileShaders': function(){
		var t = this;

		t.vertexShader = t.gl.createShader(t.gl.VERTEX_SHADER);
		t.gl.shaderSource(t.vertexShader, t.vertexCode);
		t.gl.compileShader(t.vertexShader);

		t.fragmentShader = t.gl.createShader(t.gl.FRAGMENT_SHADER);
		t.gl.shaderSource(t.fragmentShader, t.fragmentCode);
		t.gl.compileShader(t.fragmentShader);

		t.shaderProgram = t.gl.createProgram();
		t.gl.attachShader(t.shaderProgram, t.vertexShader);
		t.gl.attachShader(t.shaderProgram, t.fragmentShader);
		t.gl.linkProgram(t.shaderProgram);

		t.checkForErrors();
	},

	'checkForErrors': function(){
		var t = this;
		var errors = 0;

		if(!t.gl.getShaderParameter(t.vertexShader, t.gl.COMPILE_STATUS)){
			console.log(t.gl.getShaderInfoLog(t.vertexShader));
			errors += 1;
		}
		if(!t.gl.getShaderParameter(t.fragmentShader, t.gl.COMPILE_STATUS)){
			console.log(t.gl.getShaderInfoLog(t.fragmentShader));
			errors += 1;
		}
		if(!t.gl.getProgramParameter(t.shaderProgram, t.gl.LINK_STATUS)){
			console.log(t.gl.getProgramInfoLog(t.shaderProgram));
			errors += 1;
		}

		if(errors === 0){
			t.applyBuffer();
		}
	},

	'applyBuffer': function(){
		var t = this;

		t.vertices = new Float32Array([
			-0.5, 0.5*t.aspect, 0.5, 0.5*t.aspect,  0.5,-0.5*t.aspect,
			-0.5, 0.5*t.aspect, 0.5,-0.5*t.aspect, -0.5,-0.5*t.aspect
		]);

		var vbuffer = t.gl.createBuffer();
		t.gl.bindBuffer(t.gl.ARRAY_BUFFER, vbuffer);
		t.gl.bufferData(t.gl.ARRAY_BUFFER, t.vertices, t.gl.STATIC_DRAW);

		t.assignPointers();
	},

	'assignPointers': function(){
		var t = this;

		t.gl.useProgram(t.shaderProgram);

		t.shaderProgram.uColor = t.gl.getUniformLocation(t.shaderProgram, 'uColor');
		t.gl.uniform4fv(t.shaderProgram.uColor, [0.0, 0.3, 0.0, 1.0]);

		t.shaderProgram.aVertexPosition = t.gl.getAttribLocation(t.shaderProgram, 'aVertexPosition');
		t.gl.enableVertexAttribArray(t.shaderProgram.aVertexPosition);

		t.gl.vertexAttribPointer(t.shaderProgram.aVertexPosition, 2, t.gl.FLOAT, false, 0, 0);

		t.draw();
	},

	'draw': function(){
		console.log('draw...');

		var t = this;

		var numItems = t.vertices.length / 2;
		t.gl.drawArrays(t.gl.TRIANGLES, 0, numItems);


		setTimeout(function(){
			var r = Math.random();
			var g = Math.random();
			var b = Math.random();
			t.gl.uniform4fv(t.shaderProgram.uColor, [r, g, b, 0.5]);
			t.draw();
//			t.gl.drawArrays(t.gl.TRIANGLES, 0, numItems);
/*
			for(var i=0; i<t.vertices.length; i+=1){
				t.vertices[i] = (t.vertices[i] + 0.01);
			}

			t.compileShaders();
*/
		}, 1000);
	}
};

testGl.init();
