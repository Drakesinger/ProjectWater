/**
 * Created by horia_000 on 12-Jan-16.
 */

// Provides a convenient raytracing interface.

// ### new GL.HitTest([t, hit, normal])
//
// This is the object used to return hit test results. If there are no
// arguments, the constructed argument represents a hit infinitely far
// away.
function HitTest(t, hit, normal)
{
    this.t      = arguments.length ? t : Number.MAX_VALUE;
    this.hit    = hit;
    this.normal = normal;
}

// ### .mergeWith(other)
//
// Changes this object to be the closer of the two hit test results.
HitTest.prototype = {
    mergeWith: function (other)
    {
        if (other.t > 0 && other.t < this.t)
        {
            this.t      = other.t;
            this.hit    = other.hit;
            this.normal = other.normal;
        }
    }
};

// ### new GL.Raytracer()
//
// This will read the current modelview matrix, projection matrix, and viewport,
// reconstruct the eye position, and store enough information to later generate
// per-pixel rays using `getRayForPixel()`.
//
// Example usage:
//
//     var tracer = new Raytracer();
//     var ray = tracer.getRayForPixel(
//       gl.canvas.width / 2,
//       gl.canvas.height / 2);
//     var result = Raytracer.hitTestSphere(tracer.eye, ray, new Vector(0, 0, 0), 1);
function Raytracer()
{
    var v = glContext.getParameter(glContext.VIEWPORT);
    var m = mvMatrix;

    var axisX          = vec3.fromValues(m[0], m[4], m[8]);
    var axisY          = vec3.fromValues(m[1], m[5], m[9]);
    var axisZ          = vec3.fromValues(m[2], m[6], m[10]);
    var offset         = vec3.fromValues(m[3], m[7], m[11]);

    var negativeOffset = vec3.create();
    vec3.negate(negativeOffset, offset);

    this.eye = vec3.fromValues(vec3.dot(negativeOffset, axisX), vec3.dot(negativeOffset, axisY), vec3.dot(negativeOffset, axisZ),1);
    console.log("got the eye:");
    console.log(this.eye);

    var minX = v[0], maxX = minX + v[2];
    var minY = v[1], maxY = minY + v[3];

    // TODO - Problem here
    this.ray00    = vec4.subtract(vec4.create(), unProject(minX, minY, 1), this.eye);
    this.ray10    = vec4.subtract(vec4.create(), unProject(maxX, minY, 1), this.eye);
    this.ray01    = vec4.subtract(vec4.create(), unProject(minX, maxY, 1), this.eye);
    this.ray11    = vec4.subtract(vec4.create(), unProject(maxX, maxY, 1), this.eye);
    this.viewport = v;
}

function unProject(winX, winY, winZ, modelview, projection, viewport)
{
    /* Log
     console.log("winX " + winX);
     console.log("winY " + winY);
     console.log("winZ " + winZ);
     console.log("mv " + modelview);
     console.log("pj " + projection);
     console.log("vp " + viewport);
     */

    modelview  = modelview || mvMatrix;
    projection = projection || pMatrix;
    viewport   = viewport || glContext.getParameter(glContext.VIEWPORT);

    /* Log
     console.log("mv " + modelview.toString() + "gl.mv " + mvMatrix);
     console.log("pj " + projection + "gl.pj " + pMatrix);
     console.log("vp " + viewport + "gl.vp" + glContext.getParameter(glContext.VIEWPORT);
     */

    var point      = vec4.fromValues((winX - viewport[0]) / viewport[2] * 2 - 1, (winY - viewport[1]) / viewport[3] * 2 - 1, winZ * 2 - 1, 1);
    var tempMatrix = mat4.multiply(mat4.create(), projection, modelview);

    var resultMatrix = mat4.create();
    mat4.invert(resultMatrix, tempMatrix);
    var result       = vec4.create();
    vec4.transformMat4(result, point, resultMatrix);
    return result;
};

Raytracer.prototype = {
    // ### .getRayForPixel(x, y)
    //
    // Returns the ray originating from the camera and traveling through the pixel `x, y`.
    getRayForPixel: function (x, y)
    {
        x        = (x - this.viewport[0]) / this.viewport[2];
        y        = 1 - (y - this.viewport[1]) / this.viewport[3];
        var ray0 = vec3.lerp(vec3.create(), this.ray00, this.ray10, x);
        var ray1 = vec3.lerp(vec3.create(), this.ray01, this.ray11, x);
        return vec3.normalize(vec3.create(), vec3.lerp(vec3.create(), ray0, ray1, y));
    }
};

// ### Raytracer.hitTestBox(origin, ray, min, max)
//
// Traces the ray starting from `origin` along `ray` against the axis-aligned box
// whose coordinates extend from `min` to `max`. Returns a `HitTest` with the
// information or `null` for no intersection.
//
// This implementation uses the [slab intersection method](http://www.siggraph.org/education/materials/HyperGraph/raytrace/rtinter3.htm).
Raytracer.hitTestBox = function (origin, ray, min, max)
{
    var tMin = vec3.divide(vec3.create(), vec3.subtract(vec3.create(), min, origin), ray);
    var tMax = vec3.divide(vec3.create(), vec3.subtract(vec3.create(), max, origin), ray);

    var t1 = vec3.min(vec3.create(), tMin, tMax);
    var t2 = vec3.max(vec3.create(), tMin, tMax);

    var tNear = t1.max(); // TODO - This should not work
    var tFar = t2.min(); // TODO - This should not work

    if (tNear > 0 && tNear < tFar)
    {
        var segement = vec3.multiply(vec3.create(), ray, tNear);
        var hit      = vec3.add(vec3.create(), origin, segement);
        var epsilon  = 1.0e-6;

        vec3.add(min, min, vec3.fromValues(epsilon, epsilon, epsilon));
        vec3.subtract(max, max, vec3.fromValues(epsilon, epsilon, epsilon));

        return new HitTest(tNear, hit, vec3.fromValues(
            (hit.x > max.x) - (hit.x < min.x),
            (hit.y > max.y) - (hit.y < min.y),
            (hit.z > max.z) - (hit.z < min.z)
        ));
    }

    return null;
};

// ### GL.Raytracer.hitTestSphere(origin, ray, center, radius)
//
// Traces the ray starting from `origin` along `ray` against the sphere defined
// by `center` and `radius`. Returns a `HitTest` with the information or `null`
// for no intersection.
Raytracer.hitTestSphere = function (origin, ray, center, radius)
{

    var offset       = vec3.subtract(vec3.create(), origin, center);
    var a            = vec3.dot(ray, ray);
    var b            = 2 * vec3.dot(ray, offset);
    var c            = vec3.dot(offset, offset) - radius * radius;
    var discriminant = b * b - 4 * a * c;

    if (discriminant > 0)
    {
        var t = (-b - Math.sqrt(discriminant)) / (2 * a), hit = vec3.scaleAndAdd(vec3.create(), origin, ray, t);
        return new HitTest(t, hit, vec3.scale(vec3.create(), vec3.subtract(vec3.create(), hit, center), 1.0 / radius));
    }
    return null;
};

// ### GL.Raytracer.hitTestTriangle(origin, ray, a, b, c)
//
// Traces the ray starting from `origin` along `ray` against the triangle defined
// by the points `a`, `b`, and `c`. Returns a `HitTest` with the information or
// `null` for no intersection.
Raytracer.hitTestTriangle = function (origin, ray, a, b, c)
{
    var ab     = vec3.subtract(vec3.create(), b, a);
    var ac     = vec3.subtract(vec3.create(), c, a);
    var normal = vec3.cross(vec3.create(), ab, ac);
    vec3.normalize(normal, normal);

    var t = vec3.dot(normal, vec3.subtract(vec3.create(), a, origin)) / vec3.dot(normal, ray);

    if (t > 0)
    {
        var hit    = vec3.scaleAndAdd(vec3.create(), origin, ray, t);
        var toHit  = vec3.subtract(vec3.create(), hit, a);
        var dot00  = vec3.dot(ac, ac);
        var dot01  = vec3.dot(ac, ab);
        var dot02  = vec3.dot(ac, toHit);
        var dot11  = vec3.dot(ab, ab);
        var dot12  = vec3.dot(ab, toHit);
        var divide = dot00 * dot11 - dot01 * dot01;
        var u      = (dot11 * dot02 - dot01 * dot12) / divide;
        var v      = (dot00 * dot12 - dot01 * dot02) / divide;
        if (u >= 0 && v >= 0 && u + v <= 1)
        {
            return new HitTest(t, hit, normal);
        }
    }

    return null;
};
