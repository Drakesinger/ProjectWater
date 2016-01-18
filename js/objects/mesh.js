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

