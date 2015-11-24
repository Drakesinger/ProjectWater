/**
 * Created by hmut on 18-Nov-15.
 */

function buildQuadObj(x, y, offset, distance) {
	this.baseIndex = vertices.length / 3;

	if (this.baseIndex <= 0) {
		this.baseIndex = 0;
	}

	buildQuadMeshObj(x, y, offset, distance);
	// 2 Triangles, 6 Indices
	addTriangle(baseIndex, baseIndex + 1, baseIndex + 2);
	addTriangle(baseIndex, baseIndex + 2, baseIndex + 3);
}

function addTriangleObj(index0, index1, index2) {
	indices.push(index0, index1, index2);
}

function buildQuadMeshObj(x, y, offset, distance) {
	vertices.push(x, y, 0.0); 							// A 0
	vertices.push(x + distance, y, 0.0); 				// B 1
	vertices.push(x + distance, y + distance, 0.0); 	// C 2
	vertices.push(x, y + distance, 0.0); 				// D 3

	// Now the colors. Same as before. no change.
	colors.push(0.1, 0.1, 0.1, 1.0);
	colors.push(0.2, 0.7, 1.0, 1.0);
	colors.push(0.7, 0.1, 1.0, 1.0);
	colors.push(1.0, 0.1, 0.5, 1.0);
}

