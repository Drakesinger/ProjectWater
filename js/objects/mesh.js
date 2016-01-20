/**
 * Created by hmut on 18-Nov-15.
 */

function Mesh(options)
{
    options = options || {};
    // Use and bind a texture?
    // TODO - addTexture boolean

    // Mesh data.
    this.indices    = [];
    this.vertices   = [];
    this.colors     = [];
    this.meshBounds = [];
    this.textCoords = [];
    this.normals    = [];

    // Buffers.
    this.vertexBuffer     = null;
    this.indexBuffer      = null;
    this.colorBuffer      = null;
    this.textCoordsBuffer = null;
    this.normalsBuffer = null;
}

Mesh.prototype = {

    create: function (nrOfQuadsX, nrOfQuadsY, origin, quadLength, quadWidth)
    {
        var distanceX = ((nrOfQuadsX / 2.0) * quadLength);
        var distanceY = ((nrOfQuadsY / 2.0) * quadWidth);
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
                if (addTexture)
                {
                    this.bindTexture();
                }
            }
        }
        this.bindBuffers();
    },

    buildQuad: function (x, y, offset, distance)
    {
        var baseIndex = this.vertices.length / 3;
        if (baseIndex <= 0)
        {
            baseIndex = 0;
        }

        this.buildQuadMesh(x, y, offset, distance);
        // 2 Triangles, 6 Indices
        this.addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
        this.addTriangle(baseIndex, baseIndex + 2, baseIndex + 3);
    },

    addTriangle: function (index0, index1, index2)
    {
        this.indices.push(index0, index1, index2);
        //this.indices.push(index0, index1, index2, index0);
        var triangleNormal = normalForTriangleVertices(
            [this.vertices[index0], this.vertices[index0 + 1], this.vertices[index0 + 2]],
            [this.vertices[index1], this.vertices[index1 + 1], this.vertices[index1 + 2]],
            [this.vertices[index2], this.vertices[index2 + 1], this.vertices[index2 + 2]]);
    },

    buildQuadMesh: function (x, y, offset, distance)
    {
        // Compute the vertices location.
        var vA = [x, y, 0.0];
        var vB = [x + distance, y, 0.0];
        var vC = [x + distance, y + distance, 0.0];
        var vD = [x, y + distance, 0.0];

        // Push the vertices.
        this.vertices.push(vA[0], vA[1], vA[2]);// A 0
        this.vertices.push(vB[0], vB[1], vB[2]);// B 1
        this.vertices.push(vC[0], vC[1], vC[2]);// C 2
        this.vertices.push(vD[0], vD[1], vD[2]);// D 3

        // Since we have a plane, the normals are just [0.0,1.0,0.0];
        var planeNormal = [0.0,1.0,0.0];

        // Push the normals. For each vertex.
        this.normals.push(planeNormal[0],planeNormal[1],planeNormal[2]);
        this.normals.push(planeNormal[0],planeNormal[1],planeNormal[2]);
        this.normals.push(planeNormal[0],planeNormal[1],planeNormal[2]);
        this.normals.push(planeNormal[0],planeNormal[1],planeNormal[2]);

        // Now the colors. Same as before. no change.
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
        this.colors.push(waterColor[0], waterColor[1], waterColor[2], waterColor[3]);
    },

    bindTexture: function ()
    {
        // Define the UVs of the texture.
        //var vertexSE = this.meshBounds[0];
        this.textCoords.push(0.0, 0.0);
        //var vertexSW = this.meshBounds[1];
        this.textCoords.push(0.0, 1.0);
        //var vertexNW = this.meshBounds[2];
        this.textCoords.push(1.0, 1.0);
        //var vertexNE = this.meshBounds[3];
        this.textCoords.push(1.0, 0.0);
    },

    bindBuffers: function ()
    {
        this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
        this.indexBuffer  = getIndexBufferWithIndices(this.indices);
        this.colorBuffer  = getVertexBufferWithVertices(this.colors);
        this.normalsBuffer = getVertexBufferWithVertices(this.normals);
        if (addTexture)
        {
            this.textCoordsBuffer = getArrayBufferWithArray(this.textCoords);
        }
    },

    draw: function (options)
    {

        options = options || {gl_primitive: glContext.TRIANGLES};

        // Bind the vertex buffer.
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        // Bind the color buffer.
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

        // Bind the texture buffer.
        if (addTexture)
        {
            glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textCoordsBuffer);
            glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
        }

        // Activate the texture.
        //glContext.activeTexture(glContext.TEXTURE0);

        // Bind the texture.
        //glContext.bindTexture(glContext.TEXTURE_2D, texColorTab[currentTexID-1]);

        // Bind the index buffer.
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        glContext.drawElements(options.gl_primitive, this.indices.length, glContext.UNSIGNED_SHORT, 0);
    }
};

