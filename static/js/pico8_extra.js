// Using the custom template located here as a base : https://www.lexaloffle.com/bbs/?tid=31000
var autoresize=true; // enables autoresize. duh.
var autoplay=false; // enables autoplay when possible.

var canvas = document.getElementById("canvas");
var plate = document.getElementById("plate");
var back_link = document.getElementById("cart-back-link");


// show Emscripten environment where the canvas is
// arguments are passed to PICO-8

var Module = {};
Module.canvas = canvas;


/*
    // When pico8_buttons is defined, PICO-8 takes each int to be a live bitfield
    // representing the state of each player's buttons

    var pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0]; // max 8 players
    pico8_buttons[0] = 2 | 16; // example:player 0, RIGHT and Z held down

    // when pico8_gpio is defined, reading and writing to gpio pins will
    // read and write to these values
    var pico8_gpio = new Array(128);
*/

// key blocker. prevent cursor keys from scrolling page while playing cart.

function onKeyDown_blocker(event) {
    event = event || window.event;
    var o = document.activeElement;
    if (!o || o == document.body || o.tagName == "canvas" || o.tagName == "CANVAS")
    {
        if ([9, 32, 37, 38, 39, 40].indexOf(event.keyCode) > -1)
        {
            if (event.preventDefault) event.preventDefault();
        }
    }
}

document.addEventListener('keydown', onKeyDown_blocker, false);

//------------------------- RESIZE

function resizeCanvas()
{
    var csize=512;
    var width=Math.min(plate.parentElement.clientWidth, window.innerWidth);
    var height=Math.min(plate.parentElement.clientHeight, window.innerHeight);

    var fs=(document.fullscreenElement || document.mozFullScreenElement || document.webkitIsFullScreen || document.msFullscreenElement);
    if (autoresize || fs)
    {
        if (fs)
        {
            width = screen.width;
            height = screen.height;
        }
        else
        {
             //keep room for buttons
            height -= 32 + back_link.offsetHeight;
        }
        csize=Math.max(128,Math.min(Math.floor(width/128)*128,Math.floor(height/128)*128));
    }

    csize = '' + csize + 'px';

    plate.style.visibility="visible";//graceful resizing on load
    plate.style.width=csize; // otherwise larger buttons but black side bars with autoresize (stylish?)
    canvas.style.width = csize;
    canvas.style.height = csize;
    window.focus();
}

window.addEventListener('load', resizeCanvas, false);
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('orientationchange', resizeCanvas, false);
window.addEventListener('fullscreenchange', resizeCanvas, false);
window.addEventListener('webkitfullscreenchange', resizeCanvas, false);//for itch.app

//------------------------- FULLSCREEN

function toggleFullscreen()
{
    var frame = document.getElementById("frame");//firefox won't resize a fullscreen canvas, so let's fullscreen its frame instead

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitIsFullScreen || document.msFullscreenElement)
    {//exit fs
        frame.cancelFullscreen = frame.cancelFullscreen || frame.mozCancelFullScreen || frame.webkitCancelFullScreen;
        frame.cancelFullscreen();
    }
    else
    {//enter fs
        frame.requestFullscreen = frame.requestFullscreen || frame.mozRequestFullScreen || frame.webkitRequestFullScreen;
        frame.requestFullscreen();
    }
}

// ==========================================================================================
// krajzeg's gamepad support:https://github.com/krajzeg/pico8gamepad/
// ==========================================================================================
// ====== [CONFIGURATION] - tailor to your specific needs

// How many PICO-8 players to support?
// - if set to 1, all connected controllers will control PICO-8 player 1
// - if set to 2, controller #0 will control player 1, controller #2 - player 2, controller #3 - player 1, and so on
// - higher numbers will distribute the controls among the players in the same way
var supportedPlayers = 2;

// These flags control whether or not different types of buttons should
// be mapped to PICO-8 O and X buttons.
var mapFaceButtons = true;
var mapShoulderButtons = true;
var mapTriggerButtons = false;
var mapStickButtons = false;

// How far you have to pull an analog stick before it register as a PICO-8 d-pad direction
var stickDeadzone = 0.4;

// ====== [IMPLEMENTATION]

// Array through which we'll communicate with PICO-8.
var pico8_buttons = [0,0,0,0,0,0,0,0];

// Start polling gamepads (if supported by browser)
if (navigator.getGamepads)
    requestAnimationFrame(updateGamepads);

// Workhorse function, updates pico8_buttons once per frame.
function updateGamepads() {
var gamepads = navigator.getGamepads ? navigator.getGamepads() :[];
// Reset the array.
for (var p = 0; p < supportedPlayers; p++)
    pico8_buttons[p] = 0;
// Gather input from all known gamepads.
for (var i = 0; i < gamepads.length; i++) {
    var gp = gamepads[i];
    if (!gp || !gp.connected) continue;

    // which player is this assigned to?
    var player = i % supportedPlayers;

    var bitmask = 0;
    // directions (from axes or d-pad "buttons")
    bitmask |= (axis(gp,0) < -stickDeadzone || axis(gp,2) < -stickDeadzone || btn(gp,14)) ? 1 :0;  // left
    bitmask |= (axis(gp,0) > +stickDeadzone || axis(gp,2) > +stickDeadzone || btn(gp,15)) ? 2 :0; // right
    bitmask |= (axis(gp,1) < -stickDeadzone || axis(gp,3) < -stickDeadzone || btn(gp,12)) ? 4 :0;  // up
    bitmask |= (axis(gp,1) > +stickDeadzone || axis(gp,3) > +stickDeadzone || btn(gp,13)) ? 8 :0; // down
    // O and X buttons
    var pressedO =
        (mapFaceButtons && (btn(gp,0) || btn(gp,2))) ||
        (mapShoulderButtons && btn(gp,5)) ||
        (mapTriggerButtons && btn(gp,7)) ||
        (mapStickButtons && btn(gp,11));
    var pressedX =
        (mapFaceButtons && (btn(gp,1) || btn(gp,3))) ||
        (mapShoulderButtons && btn(gp,4)) ||
        (mapTriggerButtons && btn(gp,6)) ||
        (mapStickButtons && btn(gp,10));
    bitmask |= pressedO ? 16 :0;
    bitmask |= pressedX ? 32 :0;
    // update array for the player (keeping any info from previous controllers)
    pico8_buttons[player] |= bitmask;
    // pause button is a bit different - PICO-8 only respects the 6th bit on the first player's input
    // we allow all controllers to influence it, regardless of number of players
    pico8_buttons[0] |= (btn(gp,8) || btn(gp,9)) ? 64 :0;
}

requestAnimationFrame(updateGamepads);
}

// Helpers for accessing gamepad
function axis(gp,n) { return gp.axes[n] || 0.0; }
function btn(gp,b) { return gp.buttons[b] ? gp.buttons[b].pressed :false; }

// ==========================================================================================
// chrome autoplay policy may2018
// ==========================================================================================

var cartLoaded=false;

function loadCart()
{
    if (cartLoaded) return;
    document.getElementById("start-button").style.visibility="hidden";
    document.getElementById("frame").style.visibility="visible";

    var script = document.createElement('script');
    script.type='text/javascript';
    script.async=true;
    script.src=pico8_export_source;

    var loadFunction = function ()
    {
        cartLoaded=true;
        document.getElementById("menubar").style.visibility="visible";
        resizeCanvas();
    }
    script.onload = loadFunction;
    script.onreadystatechange = loadFunction;

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script,s);
};

if (autoplay)
{
    var context = new AudioContext();
    context.onstatechange = function ()
    {
        if (context.state=='running')
        {
            loadCart();
            context.close();
        }
    };
}