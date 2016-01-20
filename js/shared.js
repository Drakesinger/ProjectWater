/**
 * Created by hmut on 18-Nov-15.
 */
// Time
var startTime = new Date().getTime() / 1000;
var time      = new Date().getTime() / 1000;

// Canvas Data
var canvasResolution = [800.0,800.0,1.0];

// Lightpoint position.
var lightPos = vec4.fromValues(0.0,3.5,-1005.0,1.0);

// Camera position.
var cameraPosition = vec3.fromValues(0.0,0.0,0.0);

// Wave Data
var meshSize = [100, 100];
var gridSize = [1, 1];
//var quadSize = [0.5, 0.5]; // it is actually half of this, since we center it.
var quadSize = [1.0, 1.0]; // it is actually half of this, since we center it.

var pressureGrid = createTwoDimensionalArray(gridSize[0], gridSize[1]);
var minPressure  = -250;
var maxPressure  = 250;

// Wave parameters
var waveTime      = 0.5;
var waterHeight   = 0.15;
var waveWidth     = 0.7;
var waveFrequency = 0.05;
//var phaseConstant = 1.5;

// sea
var ITER_GEOMETRY   = 1;
var ITER_FRAGMENT   = 5;
var SEA_HEIGHT      = 0.4;
var SEA_CHOPPY      = 6.3;
var SEA_SPEED       = 1.8;
var SEA_FREQ        = 0.16;
var SEA_BASE        = vec3.fromValues(0.1, 0.19, 0.22);
var SEA_WATER_COLOR = vec3.fromValues(0.8, 0.9, 0.6);
var SEA_TIME        = time * SEA_SPEED;
var octave_m        = mat2.create();
octave_m[0] = 1.6;
octave_m[1] = 1.2;
octave_m[2] = -1.2;
octave_m[3] = 1.6;
var EPSILON_NRM	= 0.1 / 800.0;
var NUM_STEPS = 8;


// Useful tryout values kept.
//var Amplitudes  = [0.0, 0.0, 0.0, 0.0];
//var Amplitudes  = [1.0, 1.0, 1.0, 1.0];
//var Amplitudes  = [1.0, 0.0, 0.0, 0.0];
var Amplitudes  = [1.120, 4.50, 0.78, -0.20];
var WaveSteepness = 1.0; //min = 0.0, max = 1.0;
var WaveLengths = [15.0, 55.0, 12.0, 10.0];
var Speeds      = [1.4, 0.8, 10.9, 1.0];

var DirectionsX = [1.0, 1.0, 0.5, 1.0];
var DirectionsY = [4.0, 0.30, 0.70, -0.10];
//var DirectionsX = [1.0, 0.0, 0.0, 0.0];
//var DirectionsY = [1.0, 0.0, 0.0, 0.0];

// Water colors rgba.
var waterColor = [0.1, 0.5, 1.0, 1.0];

// For sphere only.
var vertexColor     = [];
vertexColor.push(0.7, 0.7, 1.0, 1.0);
var sphereDivisions = 0;
var indexCnt        = 0;

// Meshes.
var water = new Mesh();

// Use texture?
var addTexture = true;
var textureFileName = "img/water_texture.jpg";

// Camera and Projection Matrices
var mvMatrix = mat4.create();
var pMatrix  = mat4.create();
// Normals matrix.
var nMatrix = mat4.create();

// Perspective.
var usePerspective = true;
//var usePerspective = false;

// Translation vectors.
var vX = 0.0;
var vY = 0.0;
var vZ = -50.0;
//var vZ = 0.0;

// Rotation angles.
var rotY = 0.0;
var rotX = -70.0;
//var rotX = 0.0;

// Pixel click position.
var clickedPixel = [-1000.0,-1000.0];

// Drawing type.
var drawPrimitive = {};
var wireframe = false;

// Debugging.
var useDebugger = false;
