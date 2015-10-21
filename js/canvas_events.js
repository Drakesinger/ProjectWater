// Get the canvas element.
var myCanvas = document.getElementById('webgl-canvas');

myCanvas.addEventListener('click',
    function (evt) {
        var mousePos = getMousePosition(myCanvas, evt);
        var pX = (mousePos.x - myCanvas.width / 2.0) / myCanvas.width * 2.0;
        var pY = (myCanvas.height / 2.0 - mousePos.y) / myCanvas.height * 2.0;
        var message = 'point: ' + pX + ',' + pY;
        console.log(message);
        //setVectorXY(pX, pY);
        addPointOnScene(pX, pY);
    }, false);


myCanvas.addEventListener('wheel',
    function (evt) {
        getMouseWheelEvent(evt)
    }, true);

/**
 *
 * @param evt
 */
function getMouseWheelEvent(evt){
    var delta = evt.deltaY;
    pZ = delta / 30;
    var message = 'zoom factor:' + pZ;
    console.log(message);
    wheelEvent(pZ);
    //setVectorZ(pZ);
}

/**
 *
 * @param myCanvas
 * @param evt
 * @returns {{x: number, y: number}}
 */
function getMousePosition(myCanvas, evt) {
    var rect = myCanvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}