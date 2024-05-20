/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import type {CanvasOptions, Vector, Vector2} from '../tombraid/types/game';

export const getCanvas = (options: CanvasOptions) => {
    const canvas = document.createElement('canvas');

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();

        return false;
    });

    setCanvasOptions(canvas, options);

    return canvas;
};

export const getContext2D = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get context2d from canvas");

    return context;
};

const setCanvasOptions = (canvas: HTMLCanvasElement, options: CanvasOptions) => {
    canvas.width = options.width;
    canvas.height = options.height;
    canvas.style.backgroundColor = options.backgroundColor;

    const container = getContainer();

    // default center position, extend options in future lead by new projects
    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    container.appendChild(canvas);

    document.body.appendChild(container);
};

const getContainer = () => {
    const container = document.getElementById('container');

    if (!(container instanceof HTMLDivElement)) throw new Error("can't find div with id container");

    return container;
};

export const vector: (x?: number, y?: number) => Vector = (x: number = 0, y: number = 0) => {
    let xValue = x;
    let yValue = y;

    const add = (vecInc: Vector) => {
        xValue += vecInc.x;
        yValue += vecInc.y;
    };

    const set = (vec: Vector) => {
        xValue = vec.x;
        yValue = vec.y;
    };

    const setXY = (xInc: number, yInc: number) => {
        xValue = xInc;
        yValue = yInc;
    };

    const limit = (max: number) => {
        xValue = Math.min(max, Math.max(-max, xValue));
        yValue = Math.min(max, Math.max(-max, yValue));
    };

    const mult = (num: number) => {
        xValue *= num;
        yValue *= num;
    };
    const div = (num: number) => {
        xValue /= num;
        yValue /= num;
    };

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
        add,
        set,
        setXY,
        limit,
        mult,
        div,
    };
};

export const vector2: (x?: number, y?: number, x2?: number, y2?: number) => Vector2 = (
    x?: number,
    y?: number,
    x2?: number,
    y2?: number,
) => {
    let xValue = x || 0;
    let yValue = y || 0;
    let xValue2 = x2 || 0;
    let yValue2 = y2 || 0;

    const add = (vecInc: Vector2) => {
        xValue += vecInc.x;
        yValue += vecInc.y;
        xValue2 += vecInc.x2;
        yValue2 += vecInc.y2;
    };

    const setManual = (xInc: number, yInc: number, x2Inc: number, y2Inc: number) => {
        xValue = xInc;
        yValue = yInc;
        xValue2 = x2Inc;
        yValue2 = y2Inc;
    };

    const set = (vecInc: Vector2) => {
        xValue = vecInc.x;
        yValue = vecInc.y;
        xValue2 = vecInc.x2;
        yValue2 = vecInc.y2;
    };

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
        add,
        set,
        setManual,
    };
};
