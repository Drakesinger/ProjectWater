/**
 * Created by hmut on 17-Nov-15.
 */

function WaterPlane(length, width, quadLength, quadWidth, OriginX, OriginY,vertices,indices,colors) {
    this.length = length;
    this.width = width;
    this.quadLength = quadLength;
    this.quadWidth = quadWidth;
    this.OriginX = OriginX;
    this.OriginY = OriginY;

    this.vertices = vertices;
    this.indices = indices;
    this.colors = colors;

    this.quads = [];

    this.build = function () {
        /* Draw here a plain surface */
        var nrOfQuads = 4;
        //var distance = 1.0 / (nrOfQuads / 2);

        for (var row = -1.0; row < 1.0; row += this.quadLength) {
            for (var column = -1.0; column < 1.0; column += this.quadWidth) {
                var quad = new WaterQuad(row, column, 0, this.quadLength, this.quadWidth, this.vertices, this.colors, this.indices);
                quad.buildQuad();
                this.quads.push(quad);
            }
        }

        this.draw = function () {
            for (var t = 0; t < this.quads.length; t++) {
                this.quads[t].draw();
            }
        }
    }
}

function WaterQuad(x, y, offset, width, length, vertices, colors, indices) {

    this.x = x;
    this.y = y;
    this.offset = offset;
    this.width = width;
    this.length = length;

    this.vertices = vertices;
    this.indices = indices;
    this.colors = colors;
    this.baseIndex = vertices.length / 3;

    var vertexBuffer = null;
    var indexBuffer = null;
    var colorBuffer = null;


    this.buildQuad = function () {
        this.buildQuadMesh(x, y, offset, this.length);
        // 2 Triangles, 6 Indices
        this.addTriangle(this.baseIndex, this.baseIndex + 1, this.baseIndex + 2);
        this.addTriangle(this.baseIndex, this.baseIndex + 2, this.baseIndex + 3);
    }

    this.addTriangle = function (index0, index1, index2) {
        this.indices.push(index0, index1, index2);
    }

    this.buildQuadMesh = function (x, y, offset, distance) {
        this.vertices.push(x, y, 0.0); 							// A 0
        this.vertices.push(x + distance, y, 0.0); 				// B 1
        this.vertices.push(x + distance, y + distance, 0.0); 	// C 2
        this.vertices.push(x, y + distance, 0.0); 				// D 3

        // Now the colors. Same as before. no change.
        this.colors.push(0.1, 0.1, 0.1, 1.0);
        this.colors.push(0.2, 0.7, 1.0, 1.0);
        this.colors.push(0.7, 0.1, 1.0, 1.0);
        this.colors.push(1.0, 0.1, 0.5, 1.0);
    }

    this.draw = function () {
        /*
         glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
         glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

         glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
         glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

         glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

         glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
         */
    }
}