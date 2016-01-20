function initShaderParameters(prg)
{
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute          = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);
    // Add the normal attribute.
    prg.vertexNormalAttribute = glContext.getAttribLocation(prg, "aVertexNormal");
    glContext.enableVertexAttribArray(prg.vertexNormalAttribute);

    // Add the texture coordinate attribute
    if (addTexture)
    {
        prg.textureCoordsAttribute = glContext.getAttribLocation(prg, "aTextureCoord");
        glContext.enableVertexAttribArray(prg.textureCoordsAttribute);
    }
    // Matrix uniforms.
    prg.pMatrixUniform  = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
    prg.nMatrixUniform  = glContext.getUniformLocation(prg, 'uNMatrix');

    // Texture uniform.
    if (addTexture)
    {
        prg.colorTextureUniform = glContext.getUniformLocation(prg, "uColorTexture");
    }

    // Canvas resolution uniform.
    prg.iResolution = glContext.getUniformLocation(prg, 'iResolution');

    // Wave uniforms.
    prg.waterHeight   = glContext.getUniformLocation(prg, 'waterHeight');
    prg.waveSteepness = glContext.getUniformLocation(prg, 'uQ');
    prg.waveTime      = glContext.getUniformLocation(prg, 'waveTime');
    prg.amplitude     = glContext.getUniformLocation(prg, 'amplitude');
    prg.wavelength    = glContext.getUniformLocation(prg, 'wavelength');
    prg.speeds        = glContext.getUniformLocation(prg, 'speed');
    prg.directionsX   = glContext.getUniformLocation(prg, 'directionsX');
    prg.directionsY   = glContext.getUniformLocation(prg, 'directionsY');
    prg.iGlobalTime   = glContext.getUniformLocation(prg, 'iGlobalTime');

    //prg.pressureGrid = glContext.getUniformLocation(prg,'uPressionGrid');
    // No good.
    //setShaderConstants('waterProgram');

    // Light uniforms.
    prg.lightPositionUniform = glContext.getUniformLocation(prg, 'uLightPosition');
    //prg.drawNormalUniform       = glContext.getUniformLocation(prg, 'uDrawNormal');
    //prg.shininessUniform        = glContext.getUniformLocation(prg, 'uShininess');
    //prg.waveUniform             = glContext.getUniformLocation(prg, 'uWave');
    //prg.lightAmbientUniform     = glContext.getUniformLocation(prg, 'uLightAmbient');
    //prg.materialDiffuseUniform  = glContext.getUniformLocation(prg, 'uMaterialDiffuse');
    //prg.materialSpecularUniform = glContext.getUniformLocation(prg, 'uMaterialSpecular');

    // Camera uniform.
    prg.cameraPositionUniform = glContext.getUniformLocation(prg, 'uCameraPositon');

    // Pixel click uniform.
    prg.clickedPixelPositionUniform = glContext.getUniformLocation(prg, 'uClickPosition');

}

function SetShaderConstants(programName)
{
    setShaderConstant1F("waterHeight", waterHeight);
    setShaderConstant1FV("amplitude", Amplitudes);
    setShaderConstant1FV("wavelength", WaveLengths);
    setShaderConstant1FV("speed", Speeds);
    setShaderConstant2FV("directionsX", DirectionsX);
    setShaderConstant2FV("directionsY", DirectionsY);
    setShaderConstant1F("iGlobalTime", time);
    setShaderConstant3F("iResolution", 500, 500, 1.0)
    //setShaderConstant1F("waveWidth", waveWidth);
}


function initializeObjects()
{
    water.create(meshSize[0], meshSize[1], vec2.create(), quadSize[0], quadSize[1]);
    water.addTexture({fileName: textureFileName});
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
     glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, rttFramebuffer[index].width, rttFramebuffer[index].height, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
     var renderbuffer             = glContext.createRenderbuffer();
     glContext.bindRenderbuffer(glContext.RENDERBUFFER, renderbuffer);
     glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, rttFramebuffer[index].width, rttFramebuffer[index].height);
     glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, rttTexture[index], 0);
     glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, renderbuffer);
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

    // Vary the parameters, doesn't work so comment for now.
    //varyParameters();

    // Clear the canvas.
    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);

    // Transformation matrices.
    // Build the matrices as identity matrices.
    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);

    // Enable perspective.
    if (usePerspective)
    {
        // Set the perspective on the projection matrix.
        // Angle: 60 degrees
        // Close: 0.1
        // Far: 10000
        mat4.perspective(pMatrix, degToRad(60), c_width / c_height, 0.1, 10000);

        var translationVector = vec3.fromValues(vX, vY, vZ);
        var translationMat    = mat4.create();
        mat4.translate(translationMat, translationMat, translationVector);

        // Rotate with quaternions if the user drags.
        rotateModelViewMatrixUsingQuaternion();

        mat4.multiply(mvMatrix, translationMat, mvMatrix);
    }
    else
    {
        // Rotate with quaternions if the user drags.
        rotateModelViewMatrixUsingQuaternion();
    }

    updateCameraLocation();
    updateLightLocation();
    updateNormals();

    // Set up our uniforms.
    setupUniforms();
    updateClickPosition();

    // Draw the water mesh.
    water.draw(drawPrimitive);

}

function setupUniforms()
{
    glContext.uniform1f(prg.waveTime, waveTime);

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    glContext.uniformMatrix4fv(prg.nMatrixUniform, false, nMatrix);

    if (addTexture)
    {
        glContext.uniform1i(prg.colorTextureUniform, 0);
    }

    glContext.uniform1f(prg.waterHeight, waterHeight);
    glContext.uniform1f(prg.waveSteepness, WaveSteepness);
    glContext.uniform1fv(prg.amplitude, Amplitudes);
    glContext.uniform1fv(prg.wavelength, WaveLengths);
    glContext.uniform1fv(prg.speeds, Speeds);
    glContext.uniform1fv(prg.directionsX, DirectionsX);
    glContext.uniform1fv(prg.directionsY, DirectionsY);
    glContext.uniform1f(prg.iGlobalTime, time);
    glContext.uniform3f(prg.iResolution, canvasResolution[0], canvasResolution[1], canvasResolution[2]);
}


function initializeCamera()
{
    glContext.uniform3f(prg.cameraPositionUniform, cameraPosition[0], cameraPosition[1], cameraPosition[2]);
}

function initializeLights()
{
    // Specifiy the light position.
    glContext.uniform3f(prg.lightPositionUniform, lightPos[0], lightPos[1], lightPos[2]);
}

// See
// https://www.opengl.org/discussion_boards/showthread.php/178484-Extracting-camera-position-from-a-ModelView-Matrix
// http://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
// https://www.opengl.org/archives/resources/faq/technical/viewing.htm
// http://www.3dgep.com/understanding-the-view-matrix/
function updateCameraLocation()
{
    vec3.set(cameraPosition, mvMatrix[12], mvMatrix[13], mvMatrix[14]);
}

function updateLightLocation()
{
    vec3.transformMat4(lightPos, lightPos, mvMatrix);
}

function updateNormals()
{
    mat4.copy(mvMatrix, nMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);
}

function updateClickPosition()
{
    glContext.uniform2f(prg.clickedPixelPositionUniform, clickedPixel[0], clickedPixel[1]);
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

function changePressure(x, y)
{
    var tracer       = new Raytracer();
    var ray          = tracer.getRayForPixel(x, y);
    var pointOnPlane = vec3.create();//tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
    vec3.add(pointOnPlane, tracer.eye, vec3.scale(vec3.create(), ray, -tracer.eye[1] / ray[1]));

    console.log(pointOnPlane);

    clickedPixel[0] = x;
    clickedPixel[1] = y;
}

function initWebGL()
{
    var originalGlContext = getGLContext('webgl-canvas');
    if(!useDebugger)
    {
        glContext = originalGlContext;
    }
    else
    {
        glContext = WebGLDebugUtils.makeDebugContext(originalGlContext);
    }
    initProgram();
    initializeLights();
    initializeObjects();
    initializeCamera();
    console.table(getProgramInfo(glContext, prg).uniforms);

    renderLoop();
}
