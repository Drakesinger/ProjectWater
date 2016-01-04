/**
 * Created by hmut on 18-Nov-15.
 */
function Normalize(v) {
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
