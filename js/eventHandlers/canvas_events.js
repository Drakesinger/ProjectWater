/*******************************************************************************
 Mouse motion handling
 *******************************************************************************/

// Get a reference to the webgl canvas.
var myCanvas = document.getElementById('webgl-canvas');
myCanvas.onmousemove = handleMouseMove;
myCanvas.onmousedown = handleMouseDown;
myCanvas.onmouseup = handleMouseUp;
myCanvas.addEventListener('wheel',handleMouseWheel, false);
myCanvas.addEventListener('click',handleMouseClick, false);

// this variable will tell if the mouse is being moved while pressing the button
var dragging = false;
var oldMousePos = {x: 0.0, y: 0.0};
var mousePos;
var rotSpeed = 1.0; //rotation speed
var mouseButton;

function handleMouseMove(event) {
	event = event || window.event; // IE-ism
	mousePos = {
		x: event.clientX,
		y: event.clientY
	};
	if (dragging) {

		var dX = mousePos.x - oldMousePos.x;
		var dY = mousePos.y - oldMousePos.y;

		rotY += dX > 0 ? rotSpeed : dX < 0.0 ? -rotSpeed : 0.0;
		rotX += dY > 0 ? rotSpeed : dY < 0.0 ? -rotSpeed : 0.0;
		oldMousePos = mousePos;
	}
}

function handleMouseDown(event) {
	dragging = true;
	mouseButton = event.button;
	oldMousePos.x = oldMousePos.y = 0.0;
}

function handleMouseUp(event) {
	dragging = false;
}

/**
 * Zoom function.
 * @param event
 */
function handleMouseWheel(event)
{
	var delta = event.deltaY;
	pZ = delta / 30;
	var message = 'zoom factor:' + pZ;
	console.log("Handle:" + message);
	setVectorZ(pZ);
}


function handleMouseClick(event)
{
	var mousePos = getMousePosition(myCanvas, event);
	var pX = (mousePos.x - myCanvas.width / 2.0) / myCanvas.width * 2.0;
	var pY = (myCanvas.height / 2.0 - mousePos.y) / myCanvas.height * 2.0;
	var message = 'point: ' + pX + ',' + pY;
	//console.log(message);
    changePressure(pX,pY);
	//setVectorXY(pX, pY);
	//addPointOnScene(pX, pY);
}

function getMousePosition(myCanvas, event) {
	var rect = myCanvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

// in the next function 'currentRy' is usefull for the exercice 8-9
var currentRy = 0; //keeps the current rotation on y, used to keep the billboards orientation

/**
 * Updated rotation using Quaternions function.
 */
function rotateModelViewMatrixUsingQuaternion() {

	//use quaternion rotations for the rotation of the object with the mouse
	var yAngle = degToRad(rotY);
	currentRy += yAngle;
	var rotYQuat = quat.fromValues(0, Math.sin(yAngle / 2), 0, Math.cos(yAngle / 2));
	var xAngle = degToRad(rotX);
	var rotXQuat = quat.fromValues(Math.sin(xAngle / 2), 0, 0, Math.cos(xAngle / 2));

	var myQuaternion = quat.create();
	quat.multiply(myQuaternion, rotYQuat, rotXQuat);

	var mat4FromMyQuat = mat4.create();
	mat4.fromQuat(mat4FromMyQuat, myQuaternion);

	mat4.multiply(mvMatrix, mvMatrix, mat4FromMyQuat);
}

myCanvas.addEventListener('click',
    function (evt) {
        var mousePos = getMousePosition(myCanvas, evt);
        var pX = (mousePos.x - myCanvas.width / 2.0) / myCanvas.width * 2.0;
        var pY = (myCanvas.height / 2.0 - mousePos.y) / myCanvas.height * 2.0;
        var message = 'point: ' + pX + ',' + pY;
        //console.log(message);
        //setVectorXY(pX, pY);
        //addPointOnScene(pX, pY);
    }, false);

function changeDrawMode()
{
	wireframe = !wireframe;

    if (wireframe == true)
    {
        drawPrimitive.gl_primitive = glContext.LINE_STRIP;
    }
    else
    {
        drawPrimitive.gl_primitive = glContext.TRIANGLES;
    }

}

window.onkeydown = checkKey;

