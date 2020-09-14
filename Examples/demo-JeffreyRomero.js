/**
 * Edited by: Jeffrey Romero
 * Date: 8/26/20
 */

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
		console.error("Cannot compile vertex shader.", gl.getShaderInforLog(vertexShader));
		return; // we can't continue without a working vertex shader
	}

	// compile the fragment shader and check that it compiled correctly
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
	{
		console.error("Cannot compile fragment shader.", gl.getShaderInfoLoc(fragmentShader));
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

	// SETUP 266-368
	// Triangle's vertice positions and colors interweaved
	var triangleData = [
		// big yellow-red-pink gradient triangle in top left
		-0.5, 1.0, 1.0, 0.234, 0.0, 0.5,
		-1.0, 0.0, 0.5, 1.0, 1.0, 0.0,
		0.0, 0.0,  0.5, 1.0, 0.0, 0.0,

		// big yellow-red-pink gradient triangle in top right
		0.5, 1.0, 1.0, 0.234, 0.0, 0.5,
		0.0, 0.0, 0.5, 1.0, 0.0, 0.0,
		1.0, 0.0, 0.5, 1.0, 1.0, 0.0,

		// big yellow-red-pink gradient triangle at bottom middle
		0.0,   0.0, 1.0, 1.0, 0.0, 0.0,
		-0.5, -1.0, 0.5, 0.222, 1.0, 0.367,
		0.5,  -1.0, 0.5, 1.0, 1.0, 0.0,

		// big yellow-red-pink gradient triangle at top middle
		-0.5, 1.0, 1.0, 0.222, 1.0, 0.367,
		0.0,  0.0, 0.5, 1.0, 0.0, 0.0,
		0.5,  1.0, 1.0, 1.0, 1.0, 0.0,

		// pink gradient triangle top left
		-0.25, 1.0, 0.0, 1.0, 0.833, 0.224,
		-0.5, 0.75, 0.0, 1.0, 0.610, 0.757,
		0.0,   0.0, 0.0, 1.0, 0.902, 0.999,

		// pink gradient triangle top right
		0.25,  1.0, 0.0, 1.0, 0.833, 0.224,
		0.0,   0.0, 0.0, 1.0, 0.902, 0.999,
		0.5,  0.75, 0.0, 1.0, 0.610, 0.757,

		// small triangle top left
		-0.5,   1.0, 0.0, 1.0, 0.530, 0.224,
		-0.43, 0.70, 1.0, 0.233, 0.340, 0.757,
		-0.25,  1.0, 0.0, 1.0, 0.902, 0.610,

		// small triangle top right
		0.25,  1.0, 0.0, 1.0, 0.902, 0.610,
		0.43, 0.70, 1.0, 0.233, 0.340, 0.757,
		0.5,   1.0, 0.0, 1.0, 0.530, 0.224,

		// medium triangle middle left
		-0.5,     1.0, 0.0, 0.233, 0.340, 0.1,
		-0.777, 0.225, 0.6, 1.0, 0.530, 0.224,
		0.0,      0.0, 0.0, 1.0, 0.902, 0.610,

		// medium triangle middle right
		0.5,     1.0, 0.0, 0.233, 0.340, 0.1,
		0.0,     0.0, 0.0, 1.0, 0.902, 0.610,
		0.777, 0.225, 0.6, 1.0, 0.530, 0.224,

		// pink gradient triangle bottom left
		0.0,    0.0, 0.0, 1.0, 0.902, 0.999,
		-0.5, -0.75, 0.0, 1.0, 0.610, 0.757,
		-0.25, -1.0, 0.0, 1.0, 0.833, 0.224,

		// pink gradient triangle bottom right
		0.0,   0.0, 0.0, 1.0, 0.902, 0.999,
		0.25, -1.0, 0.0, 1.0, 0.833, 0.224,
		0.5, -0.75, 0.0, 1.0, 0.610, 0.757,

		// small triangle bottom left
		-0.43, -0.70, 1.0, 1.0, 0.902, 0.610,
		-0.5,  -1.0,  0.0, 0.233, 0.340, 0.757,
		-0.25, -1.0,  0.0, 1.0, 0.530, 0.224,

		// small triangle bottom right
		0.5,  -1.0,  0.0, 0.233, 0.340, 0.757,
		0.43, -0.70, 1.0, 1.0, 0.902, 0.610,
		0.25, -1.0,  0.0, 1.0, 0.530, 0.224,

		// medium greenish triangle bottom left
		-0.777, -0.225, 0.6, 1.0, 0.530, 0.224,
		-0.5,     -1.0, 0.0, 0.233, 0.340, 0.1,
		0.0,       0.0, 0.0, 1.0, 0.902, 0.610,

		// medium greenish triangle bottom right
		0.5,     -1.0, 0.0, 0.233, 0.340, 0.1,
		0.777, -0.225, 0.6, 1.0, 0.530, 0.224,
		0.0,      0.0, 0.0, 1.0, 0.902, 0.610,

		// big triangle bottom left
		-1.0,  0.0, 1.0, 1.0, 1.0, 0.0,
		-0.5, -1.0, 1.0, 1.0, 0.0, 0.5,
		0.0,   0.0, 0.5, 1.0, 0.0, 0.0,

		// big triangle bottom right
		0.0,  0.0, 1.0, 1.0, 0.0, 0.0,
		0.5, -1.0, 1.0, 1.0, 0.0, 0.5,
		1.0,  0.0, 0.5, 1.0, 1.0, 0.0,

		// triangle left side
		0.0, 0.0, 0.0, 1.0, 0.902, 0.610,
		-0.777, 0.225, 0.0, 1.0, 1.0, 0.224,
		-0.777, -0.225, 0.0, 1.0, 1.0, 0.224,

		// triangle right side
		0.0, 0.0, 0.0, 1.0, 0.902, 0.610,
		0.777, -0.225, 0.0, 1.0, 1.0, 0.224,
		0.777, 0.225, 0.0, 1.0, 1.0, 0.224,

		// small triangle left side
		-1.0, 0.0, 0.0, 0.555, 0.902, 0.610,
		-0.777, -0.225, 0.0, 0.555, 0.530, 0.224,
		-0.777, 0.225, 0.0, 0.555, 0.100, 0.224,

		// small triangle right side
		1.0, 0.0, 0.0, 0.555, 0.902, 0.610,
		0.777, 0.225, 0.0, 0.555, 0.100, 0.224,
		0.777, -0.225, 0.0, 0.555, 0.530, 0.224,

		// CORNER TRIANGLES

		// top left corner triangle
		-1.0, 1.0, 0.7, 0.5, 0.902, 0.610,
		-1.0, 0.0, 0.7, 0.332, 0.678, 0.999,
		-0.5, 1.0, 0.7, 0.888, 0.530, 0.678,

		// top right corner triangle
		0.5, 1.0, 0.7, 0.888, 0.530, 0.678,
		1.0, 0.0, 0.7, 0.332, 0.678, 0.999,
		1.0, 1.0, 0.7, 0.5, 0.902, 0.610,

		// bottom left corner triangle
		-1.0, 0.0, 0.7, 0.332, 0.678, 0.999,
		-1.0, -1.0, 0.7, 0.5, 0.902, 0.610,
		-0.5, -1.0, 0.7, 0.888, 0.530, 0.678,

		// bottom right corner triangle
		1.0, 0.0, 0.7, 0.332, 0.678, 0.999,
		0.5, -1.0, 0.7, 0.888, 0.530, 0.678,
		1.0, -1.0, 0.7, 0.5, 0.902, 0.610,

		// top left left-most triangle
		-1.0, 1.0, 0.4, 1.0, 0.833, 0.224,
		-1.0, 0.0, 0.4, 1.0, 0.902, 0.999,
		-0.9, 0.0, 0.4, 1.0, 0.610, 0.757,

		// top right right-most triangle
		1.0, 1.0, 0.4, 1.0, 0.833, 0.224,
		0.9, 0.0, 0.4, 1.0, 0.610, 0.757,
		1.0, 0.0, 0.4, 1.0, 0.902, 0.999,

		// bottom left left-most triangle
		-1.0, -1.0, 0.4, 1.0, 0.833, 0.224,
		-0.9, 0.0, 0.4, 1.0, 0.610, 0.757,
		-1.0, 0.0, 0.4, 1.0, 0.902, 0.999,

		// bottom right right-most triangle
		1.0, -1.0, 0.4, 1.0, 0.833, 0.224,
		1.0, 0.0, 0.4, 1.0, 0.902, 0.999,
		0.9, 0.0, 0.4, 1.0, 0.610, 0.757,

		// top middle small triangle
		0.0, 0.65, 0.0, 0.250, 0.5, 0.0,
		0.15, 1.0, 0.0, 0.0, 0.5, 1.0,
		-0.15, 1.0, 0.0, 0.0, 0.5, 1.0,

		// bottom middle small triangle
		0.0, -0.65, 0.0, 0.250, 0.5, 0.0,
		-0.15, -1.0, 0.0, 0.0, 0.5, 1.0,
		0.15, -1.0, 0.0, 0.0, 0.5, 1.0,

		// top middle medium triangle
		0.0, 0.4, 0.1, 1.0, 0.4, 0.7,
		0.20, 1.0, 0.1, 0.5, 0.4, 0.7,
		-0.20, 1.0, 0.1, 0.5, 0.4, 0.7,

		// bottom middle medium triangle
		0.0, -0.4, 0.1, 1.0, 0.4, 0.7,
		-0.20, -1.0, 0.1, 0.5, 0.4, 0.7,
		0.20, -1.0, 0.1, 0.5, 0.4, 0.7

		// the z axis goes into the screen, so the "0.5" z values are "behind" the "0.0" z values from the first triangle
		// if we change them to something less than 0.0, the new triangles will be in front of the old one
	];

	var index = [];
	var currentColorIndex = 0;
	// using length of positions array instead of colors because some colors are reused
	for (var triangle = 0; triangle < (triangleData.length / 18); triangle++) {
		for (var verticeColor = 0; verticeColor < 3; verticeColor++) {
			index.push(currentColorIndex++);
		}
	}
	
	// initialize buffers
	var attributeBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
	var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// DRAW
	gl.useProgram(program);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
	gl.vertexAttribPointer(
		positionAttribLocation,
		3, // Number of elements for each vertex (1 position has 3 elements, X Y Z)
		gl.FLOAT, // Data type for each element
		gl.FALSE, // Do we want the data to be normalized before use? No, we don't.
		6 * Float32Array.BYTES_PER_ELEMENT, // Number of bytes for each vertex (3 floats)
		0 // Number of bytes to skip at the beginning
			// this is used if you put multiple attributes (say, position and color) in one buffer
	);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
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

	// The importer imports the requested files (as strings)
	// and puts them in a dictionary called "filemap" in the RunDemo function above.
	// The dictionary is a hashmap
		// key --> file
		// so filemap["vertShadertext"] will return the text from the file at "shaders/vert.glsl"
	var importer = new resourceImporter(imports, RunDemo);
}