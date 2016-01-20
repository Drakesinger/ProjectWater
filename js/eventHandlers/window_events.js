/**
 * Created by hmut on 18-Nov-15.
 */
/**
 * Documentation:
 * http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
 */

document.getElementById("enable-scroll").onclick = function ()
{
    enableScroll();
    document.getElementById("status").innerHTML = "enabled";
    document.getElementById("status").className = "enabled";
};

document.getElementById("disable-scroll").onclick = function ()
{
    disableScroll();
    document.getElementById("status").innerHTML = "disabled";
    document.getElementById("status").className = "disabled";
};


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e)
{
    e = e || window.event;
    if (e.preventDefault)
    {
        e.preventDefault();
    }
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e)
{
    if (keys[e.keyCode])
    {
        preventDefault(e);
        return false;
    }
}

function disableScroll()
{
    if (window.addEventListener) // older FF
    {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = /*document.onmousewheel =*/ preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll()
{
    if (window.removeEventListener)
    {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel     = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function checkKey(ev)
{
    switch (ev.keyCode)
    {
      case 32:
        {
            if (useTexture == 1)
            {
                useTexture = 0;
            } else
            {
                useTexture = 1;
            }
            break;
        }

        default:
            break;
    }
}

/**
 * Set the wave parameters.
 * @param index The wave to set
 */
function setWave(index)
{
    var amplitude  = document.getElementById("amplitude" + index).value;
    var wavelength = document.getElementById("wavelength" + index).value;
    var directionX = document.getElementById("directionX" + index).value;
    var directionY = document.getElementById("directionY" + index).value;
    var speed      = document.getElementById("speed" + index).value;

    Amplitudes[index]  = amplitude;
    WaveLengths[index] = wavelength;
    Speeds[index]      = speed;
    DirectionsX[index] = directionX;
    DirectionsY[index] = directionY;
}
