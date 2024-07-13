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

    canvas.addEventListener('keydown', evt => {
        keyHeld[evt.code] = true;
    });

    canvas.addEventListener('keyup', evt => {
        delete keyHeld[evt.code];
    });

    const resize = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    };

    let timeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
        clearTimeout(timeout);
        timeout = setTimeout(resize, 250);
    };

    onresize = () => resizeCanvas();

    return {mouse, buttonHeld, keyHeld};
};
