var RunDemo = function(filemap)
{
	console.log("Initializing Triangle Demo");

	// get reference to the canvas (made in the HTML file)
	var canvas = document.getElementById("the_canvas");

	// resize canvas to fill window
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// get reference to the WebGL context
	var gl = canvas.getContext("webgl");

	// check that WebGL context was succesfully referenced
	// try to fix if not
	if (!gl)
	{
		console.log("WebGL context not found; checking for experimental WebGL");
		gl = canvas.getContext("experimental-webgl");
	}

	if (!gl)
	{
		alert("No WebGL context found; this demo requires a browswer which supports WebGL");
		return; // no WebGL means we're done, nothing to do...
	}

	// set WebGL's viewport (i.e. "where it can draw") to cover the canvas
	gl.viewport(0, 0, canvas.width, canvas.height);

	// set background color of canvas (to black)
			   // Red Green Blue Alpha
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// apply the clear color set above
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// enable the "depth test" to not render objects which are behind others
	gl.enable(gl.DEPTH_TEST);

	// set the front face of each triangle to the counterclockwise side
	gl.frontFace(gl.CCW);

	// tell WebGL that the back face is the face that should be culled (i.e. not shown)
	gl.cullFace(gl.BACK);

	// enable gl to cull faces so it can cull the back faces from above
	gl.enable(gl.CULL_FACE);

	// get vertex and fragment shader text from the importer
	var vertShaderText = filemap["vertShaderText"]; // see "InitDemo" at bottom for keys/names
	var fragShaderText = filemap["fragShaderText"];

	// create empty vertex and fragment shader objects
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	// populate the two empty shaders with the text from our imported glsl files
	gl.shaderSource(vertShader, vertShaderText);
	gl.shaderSource(fragShader, fragShaderText);

	// compile the vertex shader and check that it compiled correctly
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
	{
		// if it didn't compile correctly, log the reason in the console
		console.error("Cannot compile vertex shader.", gl.getShaderInfoLog(vertexShader));
		return; // we can't continue without a working vertex shader
	}

	// compile the fragment shader and check that it compiled correctly
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
	{
		console.error("Cannot compile fragment shader.", gl.getShaderInfoLog(fragmentShader));
		return;
	}

	// create an empty program (these two shaders together make one program)
	var program = gl.createProgram();

	// attach both shaders to the program
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);

	// link the two shaders together
		// the vertex shader feeds "varying" variables to the fragment shader
	gl.linkProgram(program);

	// check that the program linked correctly
		// if it didn't link correctly, the two shaders "don't match"
		// which most likely means their "varying" variables don't match
		// or that the vertex shader doesn't assign value to one of them
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error("Cannot link GL program.", gl.getProgramInfoLog(program));
		return;
	}

	// validate the program, check if it is valid in current WebGL context
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error("Cannot validate GL program.", gl.getProgramInfoLog(program));
		return;
	}
	
	// SETUP
	var positions = [
		//Middle of Sun
		0.1, 0.17, 0.0, 
		-0.1, 0.17, 0.0,
		0.0, 0.0, 0.0,

		0.1, 0.17, 0.0, 
		0.0, 0.0, 0.0,  
		0.2, 0.0, 0.0,

		0.0, 0.0, 0.0, 
		0.1, -0.17, 0.0,  
		0.2, 0.0, 0.0,

		0.0, 0.0, 0.0, 
		-0.1, -0.17, 0.0,
		0.1, -0.17, 0.0, 

		0.0, 0.0, 0.0, 
		-0.2, 0.0, 0.0,   
		-0.1, -0.17, 0.0,

		-0.1, 0.17, 0.0, 
		-0.2, 0.0, 0.0,   
		0.0, 0.0, 0.0,

		//Orange Spikes
		0.0, 0.5, 0.0,
		-0.1, 0.17, 0.0, 
		0.1, 0.17, 0.0,

		0.1, 0.17, 0.0, 
		0.2, 0.0, 0.0,
		0.45, 0.24, 0.0,  

		0.2, 0.0, 0.0,
		0.1, -0.17, 0.0,  
		0.45, -0.24, 0.0, 

		-0.1, -0.17, 0.0,
		0.0, -0.5, 0.0, 
		0.1, -0.17, 0.0, 

		-0.2, 0.0, 0.0,   
		-0.45, -0.24, 0.0, 
		-0.1, -0.17, 0.0,

		-0.45, 0.24, 0.0,
		-0.2, 0.0, 0.0,   
		-0.1, 0.17, 0.0, 

		//Yellow Spikes
		0.2, 0.34, 0.1,
		0.0, 0.17, 0.1,
		0.17, 0.085, 0.1,

		0.4, 0.0, 0.1,
		0.085, 0.085, 0.1,
		0.085, -0.085, 0.1,

		0.17, -0.085, 0.1,
		0.0, -0.17, 0.1,
		0.2, -0.34, 0.1,

		-0.17, -0.085, 0.1,
		-0.2, -0.34, 0.1,
		0.0, -0.17, 0.1,

		-0.085, 0.085, 0.1,
		-0.4, 0.0, 0.1,
		-0.085, -0.085, 0.1,

		-0.2, 0.34, 0.1,
		-0.17, 0.085, 0.1,
		0.0, 0.17, 0.1,

		//Face
		-0.1, -0.05, -0.1,
		0.0, -0.13, -0.1,
		0.1, -0.05, -0.1,

		-0.085, 0.085, -0.1,
		-0.115, 0.042, -0.1,
		-0.055, 0.042, -0.1,

		0.085, 0.085, -0.1,
		0.055, 0.042, -0.1,
		0.115, 0.042, -0.1
	];


	var colors = [
		//Middle of Sun
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,

		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,

		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,

		//Orange Spikes
		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,
		1.0, 0.6, 0.0,

		1.0, 0.6, 0.0,
		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,

		1.0, 0.6, 0.0,
		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,

		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,

		1.0, 0.6, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.6, 0.0,

		1.0, 0.6, 0.0,
		1.0, 0.6, 0.0,
		1.0, 0.6, 0.0,

		//Yellow Spikes
		1.0, 0.7, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		1.0, 0.7, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,
		1.0, 0.7, 0.0,

		1.0, 0.9, 0.2,
		1.0, 0.7, 0.0,
		1.0, 0.9, 0.2,

		1.0, 0.9, 0.2,
		1.0, 0.7, 0.0,
		1.0, 0.9, 0.2,

		1.0, 0.7, 0.0,
		1.0, 0.9, 0.2,
		1.0, 0.9, 0.2,

		//Face
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0
	];

	var index = [

		//Middle of Sun
		// 1
		0, 1, 2,

		// 2
		3, 4, 5,

		// 3
		6, 7, 8,

		// 4
		9, 10, 11,

		// 5
		12, 13, 14,

		// 6
		15, 16, 17,

		//Orange Spikes
		// 7
		18, 19, 20,

		// 8
		21, 22, 23,

		// 9
		24, 25, 26,

		// 10
		27, 28, 29,

		// 11
		30, 31, 32,

		// 12
		33, 34, 35,

		//Yellow Spikes
		// 13
		36, 37, 38,

		// 14
		39, 40, 41,

		// 15
		42, 43, 44,

		// 16
		45, 46, 47,

		// 17
		48, 49, 50,

		// 18
		51, 52, 53,

		//Face
		// 19
		54, 55, 56,

		// 20
		57, 58, 59,

		// 21
		60, 61, 62
	];

	var positionBuffer = gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var indexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
	var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// DRAW
	gl.useProgram(program);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);

	gl.drawElements(
		gl.TRIANGLES, 
		index.length,
		gl.UNSIGNED_SHORT,
		0
	);
}

var InitDemo = function()
{
	// files to import
	var imports = [
		// key             path
		["vertShaderText", "shaders/vert.glsl"],
		["fragShaderText", "shaders/frag.glsl"]
	];

	var importer = new resourceImporter(imports, RunDemo);
}