/*******************************************************************************
 Mouse motion handling
 *******************************************************************************/

// get a reference to the webgl canvas
var myCanvas = document.getElementById('webgl-canvas');
myCanvas.onmousemove = handleMouseMove;
myCanvas.onmousedown = handleMouseDown;
myCanvas.onmouseup = handleMouseUp;

// this variable will tell if the mouse is being moved while pressing the button
//var rotY = 0.0; //rotation on the Y-axis (in degrees)
//var rotX = 0.0; //rotation on the X-axis (in degrees)
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

// in the next function 'currentRy' is usefull for the exercice 8-9
var currentRy = 0; //keeps the current rotation on y, used to keep the billboards orientation

function rotateModelViewMatrixUsingQuaternion() {

    //use quaternion rotations for the rotation of the object with the mouse
    var yAngle = degToRad(rotY);
    currentRy += yAngle;
    var rotYQuat = quat.fromValues(0, Math.sin(yAngle / 2), 0, Math.cos(yAngle / 2));
    var xAngle = degToRad(rotX);
    var rotXQuat = quat.fromValues(Math.sin(xAngle / 2), 0, 0, Math.cos(xAngle / 2));

    var myQuaternion = quat.create();
    quat.multiply(myQuaternion, rotYQuat, rotXQuat);

    console.log("Quat: " + quat.str(myQuaternion));
    var mat4FromMyQuat = mat4.create();
    mat4.fromQuat(mat4FromMyQuat, myQuaternion);

    mat4.multiply(mvMatrix, mvMatrix, mat4FromMyQuat);

    //reset rotation values, otherwise rotation accumulates
    //rotX = 0.0;
    //rotY = 0.0;
}
