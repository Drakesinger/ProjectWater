// bteitler: A 2D hash function for use in noise generation that returns range [0 .. 1].  You could
// use any hash function of choice, just needs to deterministic and return
// between 0 and 1, and also behave randomly.  Googling "GLSL hash function" returns almost exactly
// this function: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
// Performance is a real consideration of hash functions since ray-marching is already so heavy.
/**
 *
 * @param {vec2} p
 * @returns {number}
 */
function hash(p)
{
    var h = vec2.dot(p, vec2.fromValues(127.1, 311.7));
    return fract(Math.sin(h) * 43758.5453123);
}

/**
 * Return the fractional part of a number.
 * @param x
 * @returns {number}
 */
function fract(x)
{
    return x - Math.floor(x);
}

/**
 *
 * @param {vec2} p
 * @returns {vec2}
 */
function fractV(p)
{
    return vec2.fromValues(fract(p[0]), fract(p[1]));
}


// bteitler: A 2D psuedo-random wave / terrain function.  This is actually a poor name in my opinion,
// since its the "hash" function that is really the noise, and this function is smoothly interpolating
// between noisy points to create a continuous surface.
/**
 * @param {vec2} p
 * @returns {number}
 */
function noise(p)
{
    var i = vec2.fromValues(Math.floor(p[0]), Math.floor(p[1]));
    var f = fractV(p);

    // bteitler: This is equivalent to the "smoothstep" interpolation function.
    // This is a smooth wave function with input between 0 and 1
    // (since it is taking the fractional part of <p>) and gives an output
    // between 0 and 1 that behaves and looks like a wave.  This is far from obvious, but we can graph it to see
    // Wolfram link: http://www.wolframalpha.com/input/?i=plot+x*x*%283.0-2.0*x%29+from+x%3D0+to+1
    // This is used to interpolate between random points.  Any smooth wave function that ramps up from 0 and
    // and hit 1.0 over the domain 0 to 1 would work.  For instance, sin(f * PI / 2.0) gives similar visuals.
    // This function is nice however because it does not require an expensive sine calculation.
    //f*f*(3.0-2.0*f);
    var u = vec2.create();
    vec2.multiply(f, f, f);
    vec2.scale(u, f, 3.0 - 2.0);


    // bteitler: This very confusing looking mish-mash is simply pulling deterministic random values (between 0 and 1)
    // for 4 corners of the grid square that <p> is inside, and doing 2D interpolation using the <u> function
    // (remember it looks like a nice wave!)
    // The grid square has points defined at integer boundaries.  For example, if <p> is (4.3, 2.1), we will
    // evaluate at points (4, 2), (5, 2), (4, 3), (5, 3), and then interpolate x using u(.3) and y using u(.1).
    return -1.0 + 2.0 * mix(
            mix(hash(vec2.add(vec2.create(), i, vec2.fromValues(0.0, 0.0))),
                hash(vec2.add(vec2.create(), i, vec2.fromValues(1.0, 0.0))),
                u[0]),
            mix(hash(vec2.add(vec2.create(), i, vec2.fromValues(0.0, 1.0))),
                hash(vec2.add(vec2.create(), i, vec2.fromValues(1.0, 1.0))),
                u[0]),
            u[1]);
}

/**
 * Return the product of x and (1 - a) plus the product of y and a. Component wise.
 * @param {number}x
 * @param {number}y
 * @param {number}a
 */
function mix(x, y, a)
{
    return x * (1 - a) + y * a;
}

/**
 * Return the product of x and (1 - a) plus the product of y and a. Component wise.
 * @param {vec2}x
 * @param {vec2}y
 * @param {vec2}a
 */
function mixv2(x, y, a)
{
    var r  = vec2.create();
    var tx = vec2.create();
    var ty = vec2.create();

    vec2.copy(tx, x);
    vec2.copy(ty, y);

    var am = vec2.fromValues(1 - a[0], 1 - a[1]);
    vec2.multiply(tx, x, am);
    vec2.multiply(ty, y, a);

    vec2.add(r, tx, ty);

    return r;
}

/**
 * Return the product of x and (1 - a) plus the product of y and a. Component wise.
 * @param {vec3}x
 * @param {vec3}y
 * @param {vec3}a
 */
function mixv3(x, y, a)
{
    var r  = vec3.create();
    var tx = vec3.create();
    var ty = vec3.create();

    vec3.copy(tx, x);
    vec3.copy(ty, y);

    var am = vec3.fromValues(1 - a[0], 1 - a[1], 1 - a[2]);
    vec3.multiply(tx, x, am);
    vec3.multiply(ty, y, a);

    vec3.add(r, tx, ty);

    return r;
}


// sea
// bteitler: TLDR is that this passes a low frequency random terrain through a 2D symmetric wave function that looks like this:
// http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
// The <choppy> parameter affects the wave shape.
/**
 *
 * @param {vec2} uv
 * @param {number} choppy
 * @returns {number}
 */
function sea_octave(uv, choppy)
{
    // bteitler: Add the smoothed 2D terrain / wave function to the input coordinates
    // which are going to be our X and Z world coordinates.  It may be unclear why we are doing this.
    // This value is about to be passed through a wave function.  So we have a smoothed psuedo random height
    // field being added to our (X, Z) coordinates, and then fed through yet another wav function below.
    vec2.add(uv, uv, vec2.fromValues(noise(uv), noise(uv)));

    // Note that you could simply return noise(uv) here and it would take on the characteristics of our
    // noise interpolation function u and would be a reasonable heightmap for terrain.
    // However, that isn't the shape we want in the end for an ocean with waves, so it will be fed through
    // a more wave like function.  Note that although both x and y channels of <uv> have the same value added, there is a
    // symmetry break because <uv>.x and <uv>.y will typically be different values.

    // bteitler: This is a wave function with pointy peaks and curved troughs:
    // http://www.wolframalpha.com/input/?i=1-abs%28cos%28x%29%29%3B
    var wv = vec2.fromValues(1.0 - Math.abs(Math.sin(uv[0])), 1.0 - Math.abs(Math.sin(uv[1])));

    // bteitler: This is a wave function with curved peaks and pointy troughs:
    // http://www.wolframalpha.com/input/?i=abs%28cos%28x%29%29%3B
    var swv = vec2.fromValues(Math.abs(Math.cos(uv[0])), Math.abs(Math.cos(uv[1])));

    // bteitler: Blending both wave functions gets us a new, cooler wave function (output between 0 and 1):
    // http://www.wolframalpha.com/input/?i=abs%28cos%28x%29%29+%2B+abs%28cos%28x%29%29+*+%28%281.0-abs%28sin%28x%29%29%29+-+abs%28cos%28x%29%29%29
    wv = mixv2(wv, swv, wv);

    // bteitler: Finally, compose both of the wave functions for X and Y channels into a final
    // 1D height value, shaping it a bit along the way.  First, there is the composition (multiplication) of
    // the wave functions: wv.x * wv.y.  Wolfram will give us a cute 2D height graph for this!:
    // http://www.wolframalpha.com/input/?i=%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D
    // Next, we reshape the 2D wave function by exponentiation: (wv.x * wv.y)^0.65.  This slightly rounds the base of the wave:
    // http://www.wolframalpha.com/input/?i=%7B%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D%7D%5E0.65
    // one last final transform (with choppy = 4) results in this which resembles a recognizable ocean wave shape in 2D:
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5Bx%5D%5D+%2B+Abs%5BCos%5Bx%5D%5D+%28%281.+-+Abs%5BSin%5Bx%5D%5D%29+-+Abs%5BCos%5Bx%5D%5D%29%7D+*+%7BAbs%5BCos%5By%5D%5D+%2B+Abs%5BCos%5By%5D%5D+%28%281.+-+Abs%5BSin%5By%5D%5D%29+-+Abs%5BCos%5By%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4
    // Note that this function is called with a specific frequency multiplier which will stretch out the wave.  Here is the graph
    // with the base frequency used by map and map_detailed (0.16):
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
    return Math.pow(1.0 - Math.pow(wv[0] * wv[1], 0.65), choppy);
}

// bteitler: Compute the distance along Y axis of a point to the surface of the ocean
// using a low(er) resolution ocean height composition function (less iterations).
/**
 *
 * @param {vec3} p
 * @returns {number}
 */
function map(p)
{
    var freq   = SEA_FREQ;
    var amp    = SEA_HEIGHT;
    var choppy = SEA_CHOPPY;
    var uv     = vec2.fromValues(p[0], p[2]);
    uv[0] *= 0.75;

    // bteitler: Compose our wave noise generation ("sea_octave") with different frequencies
    // and offsets to achieve a final height map that looks like an ocean.  Likely lots
    // of black magic / trial and error here to get it to look right.  Each sea_octave has this shape:
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
    // which should give you an idea of what is going.  You don't need to graph this function because it
    // appears to your left :)
    var d;
    var h = 0.0;
    for (var i = 0; i < ITER_GEOMETRY; i++)
    {
        // bteitler: start out with our 2D symmetric wave at the current frequency
        d = sea_octave(vec2.mulf(vec2.addf(uv, SEA_TIME), freq), choppy);

        // bteitler: stack wave ontop of itself at an offset that varies over time for more height and wave pattern variance
        d += sea_octave(vec2.mulf(vec2.subf(uv, SEA_TIME), freq), choppy);

        h += d * amp; // bteitler: Bump our height by the current wave function

        // bteitler: "Twist" our domain input into a different space based on a permutation matrix
        // The scales of the matrix values affect the frequency of the wave at this iteration, but more importantly
        // it is responsible for the realistic assymetry since the domain is shiftly differently.
        // This is likely the most important parameter for wave topology.
        vec2.transformMat2(uv,uv,octave_m);
        //uv *= octave_m;

        freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
        amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
        // bteitler: finally, adjust the choppy parameter which will effect our base 2D sea_octave shape a bit.  This makes
        // the "waves within waves" have different looking shapes, not just frequency and offset
        choppy = mix(choppy, 1.0, 0.2);
    }
    return p[1] - h;
}

// bteitler: Compute the distance along Y axis of a point to the surface of the ocean
// using a high(er) resolution ocean height composition function (more iterations).
/**
 *
 * @param {vec3} p
 * @returns {number}
 */
function map_detailed(p)
{
    var freq   = SEA_FREQ;
    var amp    = SEA_HEIGHT;
    var choppy = SEA_CHOPPY;
    var uv     = vec2.fromValues(p[0], p[2]);
    uv[0] *= 0.75;

    // bteitler: Compose our wave noise generation ("sea_octave") with different frequencies
    // and offsets to achieve a final height map that looks like an ocean.  Likely lots
    // of black magic / trial and error here to get it to look right.  Each sea_octave has this shape:
    // http://www.wolframalpha.com/input/?i=%7B1-%7B%7B%7BAbs%5BCos%5B0.16x%5D%5D+%2B+Abs%5BCos%5B0.16x%5D%5D+%28%281.+-+Abs%5BSin%5B0.16x%5D%5D%29+-+Abs%5BCos%5B0.16x%5D%5D%29%7D+*+%7BAbs%5BCos%5B0.16y%5D%5D+%2B+Abs%5BCos%5B0.16y%5D%5D+%28%281.+-+Abs%5BSin%5B0.16y%5D%5D%29+-+Abs%5BCos%5B0.16y%5D%5D%29%7D%7D%5E0.65%7D%7D%5E4+from+-20+to+20
    // which should give you an idea of what is going.  You don't need to graph this function because it
    // appears to your left :)
    var d;
    var h = 0.0;
    for (var i = 0; i < ITER_FRAGMENT; i++)
    {
        // bteitler: start out with our 2D symmetric wave at the current frequency
        d = sea_octave(vec2.mulf(vec2.addf(uv, SEA_TIME), freq), choppy);
        // bteitler: stack wave ontop of itself at an offset that varies over time for more height and wave pattern variance
        d += sea_octave(vec2.mulf(vec2.subf(uv, SEA_TIME), freq), choppy);
        h += d * amp; // bteitler: Bump our height by the current wave function

        // bteitler: "Twist" our domain input into a different space based on a permutation matrix
        // The scales of the matrix values affect the frequency of the wave at this iteration, but more importantly
        // it is responsible for the realistic assymetry since the domain is shiftly differently.
        // This is likely the most important parameter for wave topology.
        vec2.transformMat2(uv,uv,octave_m);
        //uv *= octave_m;

        freq *= 1.9; // bteitler: Exponentially increase frequency every iteration (on top of our permutation)
        amp *= 0.22; // bteitler: Lower the amplitude every frequency, since we are adding finer and finer detail
        // bteitler: finally, adjust the choppy parameter which will effect our base 2D sea_octave shape a bit.  This makes
        // the "waves within waves" have different looking shapes, not just frequency and offset
        choppy = mix(choppy, 1.0, 0.2);
    }
    return p[1] - h;
}

/**
 *
 * @param {vec3} p
 * @param {number} eps
 * @returns {*}
 */
function getNormal(p, eps)
{
    // bteitler: Approximate gradient.  An exact gradient would need the "map" / "map_detailed" functions
    // to return x, y, and z, but it only computes height relative to surface along Y axis.  I'm assuming
    // for simplicity and / or optimization reasons we approximate the gradient by the change in ocean
    // height for all axis.
    var n = vec3.create();

    n[1] = map_detailed(p); // bteitler: Detailed height relative to surface, temporarily here to save a variable?
    n[0] = map_detailed(vec3.fromValues(p[0] + eps, p[1], p[2])) - n.y; // bteitler approximate X gradient as change in height along X axis delta
    n[2] = map_detailed(vec3.fromValues(p[0], p[1], p[2] + eps)) - n.y; // bteitler approximate Z gradient as change in height along Z axis delta
    // bteitler: Taking advantage of the fact that we know we won't have really steep waves, we expect
    // the Y normal component to be fairly large always.  Sacrifices yet more accurately to avoid some calculation.
    n[1] = eps;
    return normalize(n);

}

// bteitler: Find out where a ray intersects the current ocean
/**
 *
 * @param {vec3} ori
 * @param {vec3} dir
 * @param {vec3} p
 * @returns {number}
 */
function heightMapTracing(ori, dir, p)
{
    var tm = 0.0;
    var tx = 1000.0; // bteitler: a really far distance, this could likely be tweaked a bit as desired

    // bteitler: At a really far away distance along the ray, what is it's height relative
    // to the ocean in ONLY the Y direction?
    var hx = map(vec3.add(vec3.create(),ori,vec3.mulf(dir,tx)));

    // bteitler: A positive height relative to the ocean surface (in Y direction) at a really far distance means
    // this pixel is pure sky.  Quit early and return the far distance constant.
    if (hx > 0.0)
    {
        return tx;
    }

    // bteitler: hm starts out as the height of the camera position relative to ocean.
    var hm = map(vec3.add(vec3.create(),ori,vec3.mulf(dir,tm)));

    // bteitler: This is the main ray marching logic.  This is probably the single most confusing part of the shader
    // since height mapping is not an exact distance field (tells you distance to surface if you drop a line down to ocean
    // surface in the Y direction, but there could have been a peak at a very close point along the x and z
    // directions that is closer).  Therefore, it would be possible/easy to overshoot the surface using the raw height field
    // as the march distance.  The author uses a trick to compensate for this.
    var tmid = 0.0;
    for (var i = 0; i < NUM_STEPS; i++)
    {
        // bteitler: Constant number of ray marches per ray that hits the water
        // bteitler: Move forward along ray in such a way that has the following properties:
        // 1. If our current height relative to ocean is higher, move forward more
        // 2. If the height relative to ocean floor very far along the ray is much lower
        //    below the ocean surface, move forward less
        // Idea behind 1. is that if we are far above the ocean floor we can risk jumping
        // forward more without shooting under ocean, because the ocean is mostly level.
        // The idea behind 2. is that if extruding the ray goes farther under the ocean, then
        // you are looking more orthgonal to ocean surface (as opposed to looking towards horizon), and therefore
        // movement along the ray gets closer to ocean faster, so we need to move forward less to reduce risk
        // of overshooting.
        tmid = mix(tm, tx, hm / (hm - hx));
        p    = vec3.add(vec3.create(),ori,vec3.mulf(dir,tmid));

        var hmid = map(p); // bteitler: Re-evaluate height relative to ocean surface in Y axis

        if (hmid < 0.0)
        {
            // bteitler: We went through the ocean surface if we are negative relative to surface now
            // bteitler: So instead of actually marching forward to cross the surface, we instead
            // assign our really far distance and height to be where we just evaluated that crossed the surface.
            // Next iteration will attempt to go forward more and is less likely to cross the boundary.
            // A naive implementation might have returned <tmid> immediately here, which
            // results in a much poorer / somewhat indeterministic quality rendering.
            tx = tmid;
            hx = hmid;
        } else
        {
            // Haven't hit surface yet, easy case, just march forward
            tm = tmid;
            hm = hmid;
        }
    }

    // bteitler: Return the distance, which should be really close to the height map without going under the ocean
    return tmid;
}


