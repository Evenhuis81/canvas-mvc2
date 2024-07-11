import {vector} from './vector';

export const getInput = (canvas: HTMLCanvasElement) => {
    const mouse = vector();

    const buttonHeld: Record<number, boolean> = {};
    const keyHeld: Record<string, boolean> = {};

    const rect = canvas.getBoundingClientRect();

    canvas.addEventListener('mousedown', evt => {
        buttonHeld[evt.button] = true;
    });

    canvas.addEventListener('mouseup', evt => {
        delete buttonHeld[evt.button];
    });

    canvas.addEventListener('mousemove', evt => {
        // mouse.setXY(+evt.offsetX.toFixed(0), +evt.offsetY.toFixed(0));

        mouse.x = +(evt.clientX - rect.left).toFixed(0);
        mouse.y = +(evt.clientY - rect.top).toFixed(0);
    });

    addEventListener('keydown', evt => {
        keyHeld[evt.code] = true;
    });

    addEventListener('keyup', evt => {
        delete keyHeld[evt.code];
    });

    return {mouse, buttonHeld, keyHeld};
};
