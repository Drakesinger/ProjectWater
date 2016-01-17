function buildTriangle(x, y, offset, distance)
{
    var baseIndex = vertices.length - (3 * 3);

    if (baseIndex <= 0)
    {
        baseIndex = 0;
    }

    buildTriangleMesh(x, y, offset, distance);
    addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
}

function buildTriangleMesh(x, y, offset, distance)
{
    vertices.push(x, y, 0.0); 							// A 0
    vertices.push(x + distance, y, 0.0); 				// B 1
    vertices.push(x + distance, y + distance, 0.0); 	// C 2

    colors.push(0.1, 0.1, 0.1, 1.0);
    colors.push(0.2, 0.7, 1.0, 1.0);
    colors.push(0.7, 0.1, 1.0, 1.0);
}


/**
 *
 * @param {int}     nrOfQuadsX
 * @param {int}     nrOfQuadsY
 * @param {vec2}    origin
 * @param {float}   quadLength
 * @param {float}   quadWidth
 * @param {Array}   outMeshBounds  The bounding vertices of the mesh in SE,SW,NW,NE order
 */
function buildBasicMesh(nrOfQuadsX, nrOfQuadsY, origin, quadLength, quadWidth, outMeshBounds)
{
    var distanceX = ((nrOfQuadsX / 2.0) * quadLength);
    var distanceY = ((nrOfQuadsY / 2.0) * quadLength);
    var x         = origin[0];
    var y         = origin[1];

    var vertexSW = [x - distanceX, y - distanceY, 0];
    var vertexSE = [x + distanceX, y - distanceY, 0];
    var vertexNW = [x - distanceX, y + distanceY, 0];
    var vertexNE = [x + distanceX, y - distanceY, 0];

    outMeshBounds.push(vertexSE, vertexSW, vertexNW, vertexNE);

    for (var i = x - distanceX; i < x + distanceX; i += quadLength)
    {
        for (var j = y - distanceY; j < y + distanceY; j += quadWidth)
        {
            //console.log("Gonna build at:[" + i + "," + j + "] of length: " + quadLength);
            buildQuad(i, j, 0, quadWidth);
        }
    }
}

function buildQuad(x, y, offset, distance)
{
    var baseIndex = vertices.length / 3;

    if (baseIndex <= 0)
    {
        baseIndex = 0;
    }

    buildQuadMesh(x, y, offset, distance);
    // 2 Triangles, 6 Indices
    addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
    addTriangle(baseIndex + 2, baseIndex + 3, baseIndex);
}

function addTriangle(index0, index1, index2)
{
    indices.push(index0, index1, index2);
}

function buildQuadMesh(x, y, offset, distance)
{
    vertices.push(x, y, 0.0); 							// A 0
    vertices.push(x + distance, y, 0.0); 				// B 1
    vertices.push(x + distance, y + distance, 0.0); 	// C 2
    vertices.push(x, y + distance, 0.0); 				// D 3

    // Now the colors. Same as before. no change.
    colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
    colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
    colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
    colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
}

function Mesh(options)
{
    options = options || {};

    // Mesh data.
    this.indices    = [];
    this.vertices   = [];
    this.colors     = [];
    this.meshBounds = [];
    this.textCoords = [];

    // Buffers.
    this.vertexBuffer     = null;
    this.indexBuffer      = null;
    this.colorBuffer      = null;
    this.textCoordsBuffer = null;
}

Mesh.prototype = {

    create: function (nrOfQuadsX, nrOfQuadsY, origin, quadLength, quadWidth)
    {
        var distanceX = ((nrOfQuadsX / 2.0) * quadLength);
        var distanceY = ((nrOfQuadsY / 2.0) * quadLength);
        var x         = origin[0];
        var y         = origin[1];

        var vertexSW = [x - distanceX, y - distanceY, 0];
        var vertexSE = [x + distanceX, y - distanceY, 0];
        var vertexNW = [x - distanceX, y + distanceY, 0];
        var vertexNE = [x + distanceX, y - distanceY, 0];

        this.meshBounds.push(vertexSE, vertexSW, vertexNW, vertexNE);

        for (var i = x - distanceX; i < x + distanceX; i += quadLength)
        {
            for (var j = y - distanceY; j < y + distanceY; j += quadWidth)
            {
                this.buildQuad(i, j, 0, quadWidth);
                this.bindTexture();
            }
        }

        this.bindBuffers();
    },

    buildQuad: function (x, y, offset, distance)
    {
        var baseIndex = this.vertices.length / 3;
        console.log("Vert length:" + this.vertices.length);
        if (baseIndex <= 0)
        {
            baseIndex = 0;
        }
        console.log("index:" + baseIndex);
        this.buildQuadMesh(x, y, offset, distance);
        // 2 Triangles, 6 Indices
        this.addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
        //this.addTriangle(baseIndex, baseIndex + 2, baseIndex + 3);
        this.addTriangle(baseIndex + 2, baseIndex + 3,baseIndex);
    },

    addTriangle: function (index0, index1, index2)
    {
        this.indices.push(index0, index1, index2);
        this.indices.push(index0, index1, index2,index0);
    },

    buildQuadMesh: function (x, y, offset, distance)
    {
        this.vertices.push(x, y, 0.0); 							// A 0
        this.vertices.push(x + distance, y, 0.0); 				// B 1
        this.vertices.push(x + distance, y + distance, 0.0); 	// C 2
        this.vertices.push(x, y + distance, 0.0); 				// D 3

        // Now the colors. Same as before. no change.
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
    },

    bindTexture: function ()
    {
        // Define the UVs of the texture.
        var vertexSE = this.meshBounds[0];
        this.textCoords.push(0.0, 0.0);
        var vertexSW = this.meshBounds[1];
        this.textCoords.push(0.0, 1.0);
        var vertexNW = this.meshBounds[2];
        this.textCoords.push(1.0, 1.0);
        var vertexNE = this.meshBounds[3];
        this.textCoords.push(1.0, 0.0);
    },

    bindBuffers: function ()
    {
        this.vertexBuffer     = getVertexBufferWithVertices(this.vertices);
        this.indexBuffer      = getIndexBufferWithIndices(this.indices);
        this.colorBuffer      = getVertexBufferWithVertices(this.colors);
        this.textCoordsBuffer = getArrayBufferWithArray(this.textCoords);
    },

    draw: function (options)
    {

        options = options || {gl_primitive: glContext.LINE_STRIP};

        // Bind the vertex buffer.
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        // Bind the color buffer.
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        // Bind the texture buffer.
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textCoordsBuffer);
        glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);

        // Activate the texture.
        //glContext.activeTexture(glContext.TEXTURE0);

        // Bind the texture.
        //glContext.bindTexture(glContext.TEXTURE_2D, texColorTab[currentTexID-1]);

        // Bind the index buffer.
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        glContext.drawElements(options.gl_primitive, this.indices.length, glContext.UNSIGNED_SHORT, 0);

    }
};

// Old code. JS is one fked up language.
//Mesh.buildQuad = function (x, y, offset, distance)
//{
//    var baseIndex = this.vertices.length / 3;
//
//    if (baseIndex <= 0)
//    {
//        baseIndex = 0;
//    }
//
//    this.buildQuadMesh(x, y, offset, distance);
//    // 2 Triangles, 6 Indices
//    this.addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
//    this.addTriangle(baseIndex, baseIndex + 2, baseIndex + 3);
//};
//
//Mesh.addTriangle =function (index0, index1, index2)
//{
//    this.indices.push(index0, index1, index2);
//};
//
//Mesh.buildQuadMesh = function (x, y, offset, distance)
//{
//    this.vertices.push(x, y, 0.0); 							// A 0
//    this.vertices.push(x + distance, y, 0.0); 				// B 1
//    this.vertices.push(x + distance, y + distance, 0.0); 	// C 2
//    this.vertices.push(x, y + distance, 0.0); 				// D 3
//
//    // Now the colors. Same as before. no change.
//    this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
//    this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
//    this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
//    this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
//};
//
//Mesh.bindBuffers = function ()
//{
//    this.vertexBuffer     = getVertexBufferWithVertices(this.vertices);
//    this.indexBuffer      = getIndexBufferWithIndices(this.indices);
//    this.colorBuffer      = getVertexBufferWithVertices(this.colors);
//    this.textCoordsBuffer = getArrayBufferWithArray(this.textCoords);
//};


function buildSphere()
{
    console.log("drawing with " + sphereDivisions + " subdivisions");
    indexCnt = 0;
    var X    = 0.525731112119133696;
    var Z    = 0.850650808352039932;

    var icosahedronVertex = [];
    icosahedronVertex.push(-X, 0.0, Z);
    icosahedronVertex.push(X, 0.0, Z);
    icosahedronVertex.push(-X, 0.0, -Z);
    icosahedronVertex.push(X, 0.0, -Z);
    icosahedronVertex.push(0.0, Z, X);
    icosahedronVertex.push(0.0, Z, -X);
    icosahedronVertex.push(0.0, -Z, X);
    icosahedronVertex.push(0.0, -Z, -X);
    icosahedronVertex.push(Z, X, 0.0);
    icosahedronVertex.push(-Z, X, 0.0);
    icosahedronVertex.push(Z, -X, 0.0);
    icosahedronVertex.push(-Z, -X, 0.0);

    var icosahedronTriangles = [];
    icosahedronTriangles.push(1, 4, 0);
    icosahedronTriangles.push(4, 9, 0);
    icosahedronTriangles.push(4, 5, 9);
    icosahedronTriangles.push(8, 5, 4);
    icosahedronTriangles.push(1, 8, 4);
    icosahedronTriangles.push(1, 10, 8);
    icosahedronTriangles.push(10, 3, 8);
    icosahedronTriangles.push(8, 3, 5);
    icosahedronTriangles.push(3, 2, 5);
    icosahedronTriangles.push(3, 7, 2);
    icosahedronTriangles.push(3, 10, 7);
    icosahedronTriangles.push(10, 6, 7);
    icosahedronTriangles.push(6, 11, 7);
    icosahedronTriangles.push(6, 0, 11);
    icosahedronTriangles.push(6, 1, 0);
    icosahedronTriangles.push(10, 1, 6);
    icosahedronTriangles.push(11, 0, 9);
    icosahedronTriangles.push(2, 11, 9);
    icosahedronTriangles.push(5, 2, 9);
    icosahedronTriangles.push(11, 2, 7);

    for (i = 0; i < icosahedronTriangles.length; i += 3)
    {
        var v1               = [];
        var v2               = [];
        var v3               = [];
        var vertexIndexStart = icosahedronTriangles[i] * 3;

        v1.push(icosahedronVertex[vertexIndexStart],
            icosahedronVertex[vertexIndexStart + 1],
            icosahedronVertex[vertexIndexStart + 2]);
        vertexIndexStart     = icosahedronTriangles[i + 1] * 3;

        v2.push(icosahedronVertex[vertexIndexStart],
            icosahedronVertex[vertexIndexStart + 1],
            icosahedronVertex[vertexIndexStart + 2]);
        vertexIndexStart     = icosahedronTriangles[i + 2] * 3;

        v3.push(icosahedronVertex[vertexIndexStart],
            icosahedronVertex[vertexIndexStart + 1],
            icosahedronVertex[vertexIndexStart + 2]);

        fromOneToFourTriangles(v1, v2, v3, sphereDivisions);
    }
}


function fromOneToFourTriangles(v1, v2, v3, depth)
{
    var v12 = [];
    var v23 = [];
    var v31 = [];
    var i;
    if (depth == 0)
    {
        // Build the Triangle

        // A
        vertices.push(v1[0], v1[1], v1[2]);
        colors.push(vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3]);
        // B
        vertices.push(v2[0], v2[1], v2[2]);
        colors.push(vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3]);
        // C
        vertices.push(v3[0], v3[1], v3[2]);
        colors.push(vertexColor[0], vertexColor[1], vertexColor[2], vertexColor[3]);

        // Indices:		0			1			2				2			1				0
        indices.push(indexCnt, indexCnt + 1, indexCnt + 2, indexCnt + 2, indexCnt + 1, indexCnt);
        indexCnt += 3;
    } else
    {
        for (i = 0; i < 3; i++)
        {
            v12.push((v1[i] + v2[i]) / 2.0);
            v23.push((v2[i] + v3[i]) / 2.0);
            v31.push((v3[i] + v1[i]) / 2.0);
        }
        v12 = Normalize(v12);
        v23 = Normalize(v23);
        v31 = Normalize(v31);
        fromOneToFourTriangles(v1, v12, v31, depth - 1);
        fromOneToFourTriangles(v2, v23, v12, depth - 1);
        fromOneToFourTriangles(v3, v31, v23, depth - 1);
        fromOneToFourTriangles(v12, v23, v31, depth - 1);
    }
}
