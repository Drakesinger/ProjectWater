/**
 * Created by hmut on 18-Nov-15.
 */
// Time
var startTime = new Date().getTime() / 1000;
var time      = new Date().getTime() / 1000;

// Canvas Data
var canvasResolution = [500.0,500.0,1.0];

// Wave Data
//var meshSize = [1, 1];
var meshSize = [1, 1];
var gridSize = [1, 1];
//var quadSize = [0.5, 0.5]; // it is actually half of this, since we center it.
var quadSize = [2.0, 2.0]; // it is actually half of this, since we center it.

var pressureGrid = createTwoDimensionalArray(gridSize[0], gridSize[1]);
var minPressure  = -250;
var maxPressure  = 250;

// Wave parameters
var waveTime      = 0.5;
var waterHeight   = 0.15;
var waveWidth     = 0.7;
var waveFrequency = 0.05;
//var phaseConstant = 1.5;

//var Amplitudes  = [0.0, 0.0, 0.0, 0.0];
//var Amplitudes  = [1.0, 1.0, 1.0, 1.0];
//var Amplitudes  = [1.120, 4.50, 0.78, -0.20];
var Amplitudes  = [1.0, 0.0, 0.0, 0.0];
var WaveSteepness = 1.0; //min = 0.0, max = 1.0;
var WaveLengths = [15.0, 55.0, 12.0, 10.0];
var Speeds      = [1.4, 0.8, 10.9, 1.0];
//var DirectionsX = [1.0, 1.0, 0.5, 1.0];
var DirectionsX = [1.0, 0.0, 0.0, 0.0];
//var DirectionsY = [1.0, 0.0, -1.0, -1.0];
//var DirectionsY = [4.0, 0.30, 0.70, -0.10];
var DirectionsY = [0.0, 0.0, -1.0, -1.0];


// Water colors rgba
var waterColor = [0.1, 0.5, 1.0, 1.0];

// Backups
/*
 var Amplitudes = [6.0,3.0,0.0,0.0];
 var WaveLengths = [30.0,55.0,12.0,10.0];
 var Speeds 	= [0.4,0.8,0.9,1.0];
 var DirectionsX = [0.5,0.4,0.1,0.9];
 var DirectionsY = [0.1,0.5,0.5,0.5];
 */

// For sphere only.
var vertexColor     = [];
vertexColor.push(0.7, 0.7, 1.0, 1.0);
var sphereDivisions = 0;
var indexCnt        = 0;

// Meshes.
var water = new Mesh();

// Use texture?
var addTexture = false;

//// Buffers.
//var vertexBuffer     = null;
//var indexBuffer      = null;
//var colorBuffer      = null;
//var textCoordsBuffer = null;
//
//// Mesh data.
//var indices           = [];
//var vertices          = [];
//var colors            = [];
//var textCoords        = [];
//var textCoordsIndices = []

// Camera and Projection Matrices
var mvMatrix = mat4.create();
var pMatrix  = mat4.create();

// Perspective.
var usePerspective = true;

// Translation vectors.
var vX = 0.0;
var vY = 0.0;
var vZ = -20.0;
//var vZ = 0.0;

// Rotation angles.
var rotY = 0.0;
var rotX = -70.0;
//var rotX = 0.0;

// Drawing type.
var drawPrimitive = {};
var wireframe = false;
