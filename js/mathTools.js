/**
 * Created by hmut on 18-Nov-15.
 */
function normalize(v) {
	var d = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	if (d != 0.0) {
		v[0] /= d;
		v[1] /= d;
		v[2] /= d;
	}
	return v;
}

function degToRad(degrees) {
	return (degrees * Math.PI / 180.0);
}

function createTwoDimensionalArray(lengthX,lengthY)
{
    var multiDimensionalArray = new Array(lengthX);
    for (var i = 0; i < lengthX; i++)
    {
        multiDimensionalArray[i] = new Array(lengthY);
    }
return multiDimensionalArray;
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
