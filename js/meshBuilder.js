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
