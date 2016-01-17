/**
 * Created by horia.mut on 25-Nov-15.
 */

const CELL_NOT_YET_COMPUTED = -1.0;
const MAX_ITERATIONS        = 7;
const SMOOTHNESS            = 0.9;
const BASE_ALTITUDE         = 0.0;
const BASE_DISPLACEMENT     = 26.0;
var wave                    = 0.5;
var vertexBuffersArray      = [];
var indexBuffersArray       = [];
var normalBuffersArray      = [];
var verticesArray           = [];
var mvMatrix                = mat4.create();
var pMatrix                 = mat4.create();
var nMatrix                 = mat4.create();
var tx                      = 0.0;
var ty                      = 0.0;
var tz                      = 0.0;

window.onkeydown = checkKey;

function checkKey(ev)
{
    switch (ev.keyCode)
    {
        case 87:
            tz++;
            break;
        case 83:
            tz--;
            break;
        case 68:
            tx++;
            break;
        case 65:
            tx--;
            break;
        case 82:
            ty++;
            break;
        case 70:
            ty--;
            break;
        default:
            console.log(ev.keyCode);
            break;
    }
}

function initShaderParameters(prg)
{
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.vertexNormalAttribute   = glContext.getAttribLocation(prg, "aVertexNormal");
    glContext.enableVertexAttribArray(prg.vertexNormalAttribute);

    prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
    prg.nMatrixUniform          = glContext.getUniformLocation(prg, 'uNMatrix');
    prg.lightPositionUniform    = glContext.getUniformLocation(prg, 'uLightPosition');
    prg.drawNormalUniform       = glContext.getUniformLocation(prg, 'uDrawNormal');
    prg.shininessUniform        = glContext.getUniformLocation(prg, 'uShininess');
    prg.waveUniform             = glContext.getUniformLocation(prg, 'uWave');
    prg.lightAmbientUniform     = glContext.getUniformLocation(prg, 'uLightAmbient');
    prg.materialDiffuseUniform  = glContext.getUniformLocation(prg, 'uMaterialDiffuse');
    prg.materialSpecularUniform = glContext.getUniformLocation(prg, 'uMaterialSpecular');
}

var terrainVertices      = [];
var terrainNormals       = [];
var terrainVertexIndices = [];
var terrainNormalIndices = [];


var terrainSide = Math.pow(2, MAX_ITERATIONS) + 1;

var terrainSize = terrainSide * terrainSide;

/**
 *
 * @param A
 * @param B
 * @param M
 * @param disp
 * @returns {*}
 */
function generateMidpoint(A, B, M, disp)
{
    var address = (M[2] * terrainSide + M[0]) * 3 + 1;
    M[1]        = terrainVertices[address];
    if (M[1] === CELL_NOT_YET_COMPUTED)
    {
        M[1]                     = (A[1] + B[1]) / 2.0 + Math.random() * disp - disp / 2.0;
        terrainVertices[address] = M[1];
    }
    return M;
}


/**
 * Algorithm:
 * Take 4 corners.
 * 1. Midpoint in middle of the 4 corners. -> Value: mean of the 4 corners + random "error".
 * 2. Create the midpoint of each side by averaging the two corners each point is between.
 *
 * @param A
 * @param B
 * @param C
 * @param D
 * @param iterations
 * @param displacement
 */
function midPointDisplacement(A, B, C, D, iterations, displacement)
{
    var halfX   = Math.round(A[0] + (B[0] - A[0]) / 2);
    var halfZ   = Math.round(A[2] + (D[2] - A[2]) / 2);
    var address = 0;

    var AB = [halfX, 0.0, Math.round(A[2])];
    var BC = [Math.round(C[0]), 0.0, halfZ];
    var CD = [halfX, 0.0, Math.round(C[2])];
    var DA = [Math.round(A[0]), 0.0, halfZ];

    AB = generateMidpoint(A, B, AB, displacement);
    BC = generateMidpoint(B, C, BC, displacement);
    CD = generateMidpoint(C, D, CD, displacement);
    DA = generateMidpoint(D, A, DA, displacement);

    var E                                                = [halfX, (AB[1] + BC[1] + CD[1] + DA[1]) / 4.0 + Math.random() * displacement - displacement / 2.0, halfZ];
    terrainVertices[(E[2] * terrainSide + E[0]) * 3 + 1] = E[1];
    if (++iterations < MAX_ITERATIONS)
    {
        var newDisplacement = Math.pow(2, -SMOOTHNESS) * displacement;
        midPointDisplacement(A, AB, E, DA, iterations, newDisplacement);
        midPointDisplacement(AB, B, BC, E, iterations, newDisplacement);
        midPointDisplacement(E, BC, C, CD, iterations, newDisplacement);
        midPointDisplacement(DA, E, CD, D, iterations, newDisplacement);
    }
}

function setupTerrainIndices()
{
    for (var row = 1; row < terrainSide; row++)
    {
        for (var i = 0; i < terrainSide - 1; i++)
        {
            var index              = (row * terrainSide + i);
            var v0                 = index * 3;
            var v1                 = (index - terrainSide + 1) * 3;
            var v2                 = (index - terrainSide) * 3;
            var v3                 = (index + 1) * 3;
            terrainVertexIndices.push(v0 / 3, v1 / 3, v2 / 3, v0 / 3, v3 / 3, v1 / 3);
            var triangleNormal     = normalForTriangleVertices([terrainVertices[v0], terrainVertices[v0 + 1], terrainVertices[v0 + 2]], [terrainVertices[v1], terrainVertices[v1 + 1], terrainVertices[v1 + 2]], [terrainVertices[v2], terrainVertices[v2 + 1], terrainVertices[v2 + 2]]);
            terrainNormals[v0]     = triangleNormal[0];
            terrainNormals[v0 + 1] = triangleNormal[1];
            terrainNormals[v0 + 2] = triangleNormal[2];
            terrainNormals[v1]     = triangleNormal[0];
            terrainNormals[v1 + 1] = triangleNormal[1];
            terrainNormals[v1 + 2] = triangleNormal[2];
            terrainNormals[v2]     = triangleNormal[0];
            terrainNormals[v2 + 1] = triangleNormal[1];
            terrainNormals[v2 + 2] = triangleNormal[2];
            triangleNormal         = normalForTriangleVertices([terrainVertices[v0], terrainVertices[v0 + 1], terrainVertices[v0 + 2]], [terrainVertices[v3], terrainVertices[v3 + 1], terrainVertices[v3 + 2]], [terrainVertices[v1], terrainVertices[v1 + 1], terrainVertices[v1 + 2]]);
            terrainNormals.push(triangleNormal[0], triangleNormal[1], triangleNormal[2]);
            terrainNormals.push(triangleNormal[0], triangleNormal[1], triangleNormal[2]);
            terrainNormals.push(triangleNormal[0], triangleNormal[1], triangleNormal[2]);
            terrainNormals[v3]     = triangleNormal[0];
            terrainNormals[v3 + 1] = triangleNormal[1];
            terrainNormals[v3 + 2] = triangleNormal[2];
        }
    }
}

function initTerrainVertices()
{
    var o = -terrainSide / 2;
    for (var i = 0; i < terrainSize; i++)
    {
        terrainVertices.push(o + i % (terrainSide));
        terrainVertices.push(CELL_NOT_YET_COMPUTED);
        terrainVertices.push(o + Math.floor(i / (terrainSide)));
        terrainNormals.push(0.0, 1.0, 0.0);
    }
}

function createTerrain()
{
    initTerrainVertices();
    var displacement = BASE_DISPLACEMENT;
    midPointDisplacement(
        // x                        y (height)                 z
        [0.0, Math.random() * displacement, 0.0],
        [terrainSide - 1.0, Math.random() * displacement, 0.0],
        [terrainSide - 1.0, Math.random() * displacement, terrainSide - 1.0],
        [0.0, Math.random() * displacement, terrainSide - 1.0]
        , 0, displacement);
    var maxAdd       = terrainSide * terrainSide * 3;
    for (add = 1; add < maxAdd; add += 3)
    {
        terrainVertices[add] += BASE_ALTITUDE;
    }
    setupTerrainIndices();

    vertexBuffer  = getVertexBufferWithVertices(terrainVertices);
    normalsBuffer = getVertexBufferWithVertices(terrainNormals);
    indexBuffer   = getIndexBufferWithIndices(terrainVertexIndices);

    vertexBuffersArray.push(vertexBuffer);
    indexBuffersArray.push(indexBuffer);
    normalBuffersArray.push(normalsBuffer);
    verticesArray.push(terrainVertexIndices);
}

function normalForTriangleVertices(v0, v1, v2)
{
    var v01 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    var v02 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
    return normalize(crossProduct(v01, v02));
}

function crossProduct(u, v)
{
    var p = [];
    p.push(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
    return p;
}

function normalize(v)
{
    var n = [];
    m     = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    n.push(v[0] / m, v[1] / m, v[2] / m);
    return n;
}

function initLights()
{
    glContext.uniform3f(prg.lightPositionUniform, 0, 0, 1);
    glContext.uniform3f(prg.lightAmbientUniform, 0.1, 0.1, 0.1);
    glContext.uniform3f(prg.materialSpecularUniform, 0.5, 0.5, 0.5);
    glContext.uniform3f(prg.materialDiffuseUniform, 0.6, 0.6, 0.6);
    glContext.uniform1f(prg.shininessUniform, 10000.0);
    glContext.uniform1f(prg.waveUniform, 0.5);
}

function drawObject(modelViewMatrix, vertexBuffer, normalsBuffer, indexBuffer, indexCount, glPrimitive)
{
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, modelViewMatrix);
    wave += 0.01;

    if (wave > 1.0)
    {
        wave = 0.0;
    }

    glContext.uniform1f(prg.waveUniform, wave);

    mat4.copy(modelViewMatrix, nMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

    glContext.uniformMatrix4fv(prg.nMatrixUniform, false, nMatrix);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, normalsBuffer);
    glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

    glContext.drawElements(glPrimitive, indexCount, glContext.UNSIGNED_SHORT, 0);
}

function startRenderLoop()
{
    initLights();
    mat4.identity(mvMatrix);
    tx   = 0.0;
    ty   = 0.0;
    tz   = -(terrainSide - 10);
    rotX = 90.0;
    rotateModelViewMatrixUsingQuaternion();
    renderLoop();
}

function drawScene()
{
    glContext.clearColor(0.9, 0.9, 1.0, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.perspective(60, c_width / c_height, 0.1, 1000.0, pMatrix);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);

    if (verticesArray.length > 0)
    {
        translationMat      = mat4.create();
        mat4.identity(translationMat);
        mat4.translate(translationMat, translationMat, vec3.fromValues(tx, ty, tz));
        rotateModelViewMatrixUsingQuaternion();
        var modelViewMatrix = mat4.multiply(mat4.create(), translationMat, mvMatrix);
        glContext.uniform1i(prg.drawNormalUniform, 0);
        glContext.uniform3f(prg.materialDiffuseUniform, 0.6, 0.6, 0.6);
        drawObject(modelViewMatrix, vertexBuffersArray[0], normalBuffersArray[0], indexBuffersArray[0], verticesArray[0].length, glContext.TRIANGLE_STRIP);
    }
}
function initWebGL()
{
    glContext = getGLContext('webgl-canvas');
    initProgram();
    createTerrain();
    startRenderLoop();
}
