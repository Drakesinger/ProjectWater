/**
 * Created by hmut on 18-Nov-15.
 */
/**
 * Documentation:
 * http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
 */

document.getElementById("enable-scroll").onclick = function() {
    enableScroll();
    document.getElementById("status").innerHTML = "enabled";
    document.getElementById("status").className = "enabled";
};

document.getElementById("disable-scroll").onclick = function() {
    disableScroll();
    document.getElementById("status").innerHTML = "disabled";
    document.getElementById("status").className = "disabled";
};



// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = /*document.onmousewheel =*/ preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function checkKey(ev) {
    console.log("RotX:" + rotX + " RotY:" + rotY);
    switch (ev.keyCode) {
        case 189:
        case 173:
        case 109: {
            if (sphereDivisions > 0)--sphereDivisions;
            initBuffers();
            break;
        }
        case 49:
        case 107: {
            if (sphereDivisions < 6)++sphereDivisions;
            initBuffers();
            break;
        }
        case 65: {
            rotY -= 2.0;
            break;
        }
        case 68: {
            rotY += 2.0;
            break;
        }
        case 87: {
            rotX -= 2.0;
            break;
        }
        case 83: {
            rotX += 2.0;
            break;
        }
        default:
            break;
    }
}

function setWave(index)
{
    var amplitude = document.getElementById("amplitude"+index).getAttribute("value");
    var wavelength = document.getElementById("wavelength"+index).getAttribute("value");
    var directionX = document.getElementById("directionX"+index).getAttribute("value");
    var directionY = document.getElementById("directionY"+index).getAttribute("value");
    var speed = document.getElementById("speed"+index).getAttribute("value");

    Amplitudes[index] = amplitude;
    WaveLengths[index] = wavelength;
    Speeds[index] = speed;
    DirectionsX[index] = directionX;
    DirectionsY[index] = directionY;
}
