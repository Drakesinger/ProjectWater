# GLSL

## Data

### Identifiers

Uniform - Fixed data <br>
Attribute - Data sent through a table to each Vertex Shader <br>
Varying - Data sent from Vertex Shader to Fragment Shader <br>

### Vectors
*t*vec**d**

With *t* (type): 
- i for integer
- b for booleans
- blank for reals

With **d** (dimension):
- 1 to 4

### Matrices

Always real numbers.<br>
Dimensions: 2x2, 3x3, 4x4 <br>
Nomation: mat2, mat3, mat4

### Textures

Dimensions: 2x2, 3x3, 4x4 <br>
Nomation: sample2D, sample3D, sample4D

Two types:
* 6 faced texture representation: sampleCube
* Depth texture representation for shadows with only 2 dimensions possible:
	- sampler1DShadow, sampler2DShadow

## Shaders
### Vertex Shader
