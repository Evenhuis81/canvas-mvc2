/* eslint-disable max-lines-per-function */
import {Vector, Vector2} from './types/vector';

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

export const vec = {
    random2D: () => vec.fromAngle(Math.random() * (Math.PI * 2)),
    fromAngle: (angle: number) => vector(Math.cos(angle), Math.sin(angle)),
};

// const add = (vecInc: Vector) => {
//     xValue += vecInc.x;
//     yValue += vecInc.y;
// };

// const set = (vec: Vector) => {
//     xValue = vec.x;
//     yValue = vec.y;
// };

// const setXY = (xInc: number, yInc: number) => {
//     xValue = xInc;
//     yValue = yInc;
// };

// const limit = (max: number) => {
//     xValue = Math.min(max, Math.max(-max, xValue));
//     yValue = Math.min(max, Math.max(-max, yValue));
// };

// const mult = (num: number) => {
//     xValue *= num;
//     yValue *= num;
// };
// const div = (num: number) => {
//     xValue /= num;
//     yValue /= num;
// };
