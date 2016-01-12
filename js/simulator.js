function initShaderParameters(prg)
{
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute          = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);

    // Add the texture coordinate attribute
    prg.textureCoordsAttribute = glContext.getAttribLocation(prg, "aTextureCoord");
    glContext.enableVertexAttribArray(prg.textureCoordsAttribute);

    // Matrix uniforms.
    prg.pMatrixUniform  = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');

    // Texture uniform.
    prg.colorTextureUniform = glContext.getUniformLocation(prg, "uColorTexture");

    // Wave time.
    prg.waterHeight = glContext.getUniformLocation(prg, 'waterHeight');
    prg.waveTime    = glContext.getUniformLocation(prg, 'waveTime');
    prg.amplitude   = glContext.getUniformLocation(prg, 'amplitude');
    prg.wavelength  = glContext.getUniformLocation(prg, 'wavelength');
    prg.speed       = glContext.getUniformLocation(prg, 'speed');
    prg.directionsX = glContext.getUniformLocation(prg, 'directionsX');
    prg.directionsY = glContext.getUniformLocation(prg, 'directionsY');
    prg.iGlobalTime = glContext.getUniformLocation(prg, 'iGlobalTime');

    //prg.pressureGrid = glContext.getUniformLocation(prg,'uPressionGrid');
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
    indices        = [];
    vertices       = [];
    colors         = [];
    var meshBounds = [];

    buildBasicMesh(meshSize[0], meshSize[1], vec2.create(), quadSize[0], quadSize[1], meshBounds);

    initializePressureGrid(meshBounds);
    initializeTextureCoordinates(meshBounds);

    vertexBuffer     = getVertexBufferWithVertices(vertices);
    indexBuffer      = getIndexBufferWithIndices(indices);
    colorBuffer      = getVertexBufferWithVertices(colors);
    textCoordsBuffer = getArrayBufferWithArray(textCoords);
}
// TODO - Fix the problem here.
function initializeTextureCoordinates(meshBounds)
{
    // Define the UVs of the texture.
    var vertexSE = meshBounds[0];
    textCoords.push(0.0, 0.0);
    var vertexSW = meshBounds[1];
    textCoords.push(0.0, 1.0);
    var vertexNW = meshBounds[2];
    textCoords.push(1.0, 1.0);
    var vertexNE = meshBounds[3];
    textCoords.push(1.0, 0.0);
}

function initializePressureGrid(meshBounds)
{
    for (var x = 0; x < gridSize[0]; x++)
    {
        for (var y = 0; y < gridSize[1]; y++)
        {
            pressureGrid[x][y] = 0.0;
        }
    }
}

/**
 * TODO - Find out how to bind the two-dimensional array with the texture.
 */
function initializePressureBuffer()
{
    /*
     rttFramebuffer[index]        = glContext.createFramebuffer();
     glContext.bindFramebuffer(glContext.FRAMEBUFFER, rttFramebuffer[index]);
     rttFramebuffer[index].width  = textureSize;
     rttFramebuffer[index].height = textureSize;
     rttTexture[index]            = glContext.createTexture();
     glContext.bindTexture(glContext.TEXTURE_2D, rttTexture[index]);
     glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
     glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
     glContext.texImage2D(
     glContext.TEXTURE_2D, 0, glContext.RGBA, rttFramebuffer[index].width,
     rttFramebuffer[index].height, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
     var renderbuffer             = glContext.createRenderbuffer();
     glContext.bindRenderbuffer(glContext.RENDERBUFFER, renderbuffer);
     glContext.renderbufferStorage(
     glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16,
     rttFramebuffer[index].width, rttFramebuffer[index].height);
     glContext.framebufferTexture2D(
     glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0,
     glContext.TEXTURE_2D, rttTexture[index], 0);
     glContext.framebufferRenderbuffer(
     glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT,
     glContext.RENDERBUFFER, renderbuffer);
     glContext.bindTexture(glContext.TEXTURE_2D, null);
     glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);
     glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
     */
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

    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
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

    glContext.uniform1i(prg.colorTextureUniform, 0);

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

    // Bind the texture buffer.
    glContext.bindBuffer(glContext.ARRAY_BUFFER, textCoordsBuffer);
    glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);

    // Activate the texture.
    //glContext.activeTexture(glContext.TEXTURE0);

    // Bind the texture.
    //glContext.bindTexture(glContext.TEXTURE_2D, texColorTab[currentTexID-1]);

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
    glContext             = WebGLDebugUtils.makeDebugContext(originalGlContext);

    //initializePressureGrid();
    //initializePressureBuffer();
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

function changePressure(pX, pY)
{
    console.log("Can i do this? [" + pX + "," + pY + "]");
}
