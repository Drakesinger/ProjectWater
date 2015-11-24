function initShaderParameters(prg)
{
	prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute          = glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');

	// Wave time.
	prg.waterHeight = glContext.getUniformLocation(prg, 'waterHeight');
	prg.waveTime    = glContext.getUniformLocation(prg, 'waveTime');
	prg.amplitude   = glContext.getUniformLocation(prg, 'amplitude');
	prg.wavelength  = glContext.getUniformLocation(prg, 'wavelength');
	prg.speed       = glContext.getUniformLocation(prg, 'speed');
	prg.directionsX = glContext.getUniformLocation(prg, 'directionsX');
	prg.directionsY = glContext.getUniformLocation(prg, 'directionsY');
	prg.iGlobalTime = glContext.getUniformLocation(prg, 'iGlobalTime');

	// No good.
	//SetShaderConstants('waterProgram');
}

function SetShaderConstants(programName)
{
	SetShaderConstant1F("waterHeight", waterHeight);
	SetShaderConstant1FV("amplitude", Amplitudes);
	SetShaderConstant1FV("wavelength", WaveLengths);
	SetShaderConstant1FV("speed", Speeds);
	SetShaderConstant2FV("directionsX", DirectionsX);
	SetShaderConstant2FV("directionsY", DirectionsY);
	SetShaderConstant1F("iGlobalTime", time);
	SetShaderConstant3F("iResolution", 500, 500, 1.0)
	//SetShaderConstant1F("waveWidth", waveWidth);
}

function initBuffers()
{
	indices  = [];
	vertices = [];
	colors   = [];

	buildBasicMesh(10, vec2.create(), 1.5, 1.5);
	//buildSphere();
	//buildQuad(-1,-1,0,2.0);
	//buildQuad(-1,-1,0,0.5);
	//water = new WaterPlane(2.0,2.0,0.5,0.5,0.0,0.0,vertices,indices,colors);
	//water.build();

	//console.log('Coord: ' + vertices.length + ', ' + 'Indices: ' + indices.length + ', ' + 'ColorRGB: ' + colors.length);

	vertexBuffer = getVertexBufferWithVertices(vertices);
	indexBuffer  = getIndexBufferWithIndices(indices);
	colorBuffer  = getVertexBufferWithVertices(colors);
}

function varyParameters()
{

	var Amplitudes  = [Math.random(), Math.random(), Math.random(), Math.random()];
	var WaveLengths = [30.0, Math.random(), 12.0, Math.random()];
	var Speeds      = [0.4, 0.8, 0.9, 1.0];
}

function drawScene()
{
	// Update the global timer.
	time = (new Date()).getTime() / 1000 - startTime;
	waveTime += waveFrequency;

	//varyParameters();

	glContext.clearColor(0.1, 0.1, 0.1, 1.0);
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	glContext.viewport(0, 0, c_width, c_height);

	// Transformation matrices.
	// Build the matrices as identity matrices.

	mat4.identity(pMatrix);
	mat4.identity(mvMatrix);


	// With perspective
	if (true)
	{
		// Set the perspective on the projection matrix.
		// Angle: 60 degrees
		// Close: 0.1
		// Far: 10000
		mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 10000);

		var translationVector = vec3.fromValues(vX, vY, vZ);
		var translationMat    = mat4.create();
		mat4.translate(translationMat, translationMat, translationVector);

		rotateModelViewMatrixUsingQuaternion();

		mat4.multiply(mvMatrix, translationMat, mvMatrix);
	}

	setupUniforms();

	//water.draw();

	drawObject();
}

function setupUniforms()
{
	glContext.uniform1f(prg.waveTime, waveTime)

	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

	glContext.uniform1f(prg.waterHeight, waterHeight);
	glContext.uniform1fv(prg.amplitude, Amplitudes);
	glContext.uniform1fv(prg.wavelength, WaveLengths);
	glContext.uniform1fv(prg.speed, Speeds);
	glContext.uniform1fv(prg.directionsX, DirectionsX);
	glContext.uniform1fv(prg.directionsY, DirectionsY);
	glContext.uniform1f(prg.iGlobalTime, time);
}

function drawObject()
{
	glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
	glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

	glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
	glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
	if (wireframe)
	{
		glContext.drawElements(glContext.LINE_STRIP, indices.length, glContext.UNSIGNED_SHORT, 0);
	}
	else
	{
		glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
	}
}




function initWebGL()
{
	var originalGlContext = getGLContext('webgl-canvas');
	glContext         = WebGLDebugUtils.makeDebugContext(originalGlContext);

	initProgram();
	initBuffers();
	console.table(getProgramInfo(glContext, prg).uniforms);
	renderLoop();
}


function setVectorZ(z)
{
	if (vZ - z > 0)
	{
		vZ = -2;
	}
	else
	{
		vZ -= z;
	}
}