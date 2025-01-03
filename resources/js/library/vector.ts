/* eslint-disable max-lines-per-function */
export const vector: (x?: number, y?: number) => Vector = (x: number = 0, y: number = 0) => {
    let xValue = x;
    let yValue = y;

    return {
        get x() {
            return xValue;
        },
        set x(xInc) {
            xValue = xInc;
        },
        get y() {
            return yValue;
        },
        set y(yInc) {
            yValue = yInc;
        },
    };
};

export const vector2: (x?: number, y?: number, x2?: number, y2?: number) => Vector2 = (
    x: number = 0,
    y: number = 0,
    x2: number = 0,
    y2: number = 0,
) => {
    let xValue = x;
    let yValue = y;
    let xValue2 = x2;
    let yValue2 = y2;

    return {
        get x() {
            return xValue;
        },
        set x(xInc) {
            xValue = xInc;
        },
        get y() {
            return yValue;
        },
        set y(yInc) {
            yValue = yInc;
        },
        get x2() {
            return xValue2;
        },
        set x2(xInc) {
            xValue2 = xInc;
        },
        get y2() {
            return yValue2;
        },
        set y2(yInc) {
            yValue2 = yInc;
        },
    };
};

/**
 * Static methods for Vectors
 */
export const vec = {
    /** Create a unit Vector with a random direction */
    random: () => vec.fromAngle(Math.random() * (Math.PI * 2)),
    /** Make a new Vector from a given angle */
    fromAngle: (angle: number) => vector(Math.cos(angle), Math.sin(angle)),
    /** Add 2nd Vector to the 1st */
    add: (v1: Vector, v2: Vector) => {
        v1.x += v2.x;
        v1.y += v2.y;
    },
    /** Subtract 2nd Vector from the 1st */
    sub: (v1: Vector, v2: Vector) => {
        v1.x -= v2.x;
        v1.y -= v2.y;
    },
    /** Multiply 1st Vector by the 2nd */
    mult: (v1: Vector, v2: Vector) => {
        v1.x *= v2.x;
        v1.y *= v2.y;
    },
    /** Divide 1st Vector by the 2nd */
    div: (v1: Vector, v2: Vector) => {
        v1.x /= v2.x;
        v1.y /= v2.y;
    },
    /** Set a maximum and minimum value for a Vector */
    limit: (v: Vector, min: number, max: number) => {
        v.x = Math.min(max, Math.max(min, v.x));
        v.y = Math.min(max, Math.max(min, v.y));
    },
    /** Get the magnitude of a Vector */
    mag: (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y),
    /** Multiply Vector by a scalar value */
    multScalar: (v: Vector, scalar: number) => {
        v.x *= scalar;
        v.y *= scalar;
    },
};
