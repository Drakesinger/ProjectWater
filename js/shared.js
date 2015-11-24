/**
 * Created by hmut on 18-Nov-15.
 */
// Time
var startTime = new Date().getTime() / 1000;
var time      = new Date().getTime() / 1000;

var water = null;

// Wave parameters
var waveTime      = 0.5;
var waterHeight   = 0.15;
var waveWidth     = 0.7;
var waveFrequency = 0.05;
//var phaseConstant = 1.5;

var Amplitudes  = [1.0, 0.0, 0.0, 0.0];
var WaveLengths = [4.0, 55.0, 12.0, 10.0];
var Speeds      = [1.4, 0.8, 0.9, 1.0];
var DirectionsX = [2.0, 0.4, 0.1, 0.9];
var DirectionsY = [0.5, 0.5, 0.5, 0.5];

// Water colors rgba
var waterColor = [0.1,0.5,1.0,1.0];

// Backups
/*
 var Amplitudes 	= [6.0,3.0,0.0,0.0];
 var WaveLengths = [30.0,55.0,12.0,10.0];
 var Speeds 		= [0.4,0.8,0.9,1.0];
 var DirectionsX = [0.5,0.4,0.1,0.9];
 var DirectionsY = [0.1,0.5,0.5,0.5];
 */
// For sphere only.
var vertexColor     = [];
vertexColor.push(0.7, 0.7, 1.0, 1.0);
var sphereDivisions = 0;
var indexCnt        = 0;

var vertexBuffer = null;
var indexBuffer  = null;
var colorBuffer  = null;
var indices      = [];
var vertices     = [];
var colors       = [];

// Camera and Projection Matrices
var mvMatrix = mat4.create();
var pMatrix  = mat4.create();

// Translation vectors.
var vX = 0;
var vY = 0;
var vZ = -20;

// Rotation angles.
var rotY = 0;
var rotX = -70; //-70

// Drawing type.
var wireframe = true;