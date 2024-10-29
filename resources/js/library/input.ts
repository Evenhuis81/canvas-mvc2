/* eslint-disable max-lines-per-function */
const resizeCB: (() => void)[] = [];
const consoleToggleCB: (() => void)[] = [];

const listeners: {
    mousedown: (() => void)[];
    mousemove: (() => void)[];
    mouseup: (() => void)[];
    keyup: (() => void)[];
    keydown: (() => void)[];
    touchstart: (() => void)[];
    touchmove: (() => void)[];
    touchend: (() => void)[];
} = {
    mousedown: [],
    mousemove: [],
    mouseup: [],
    keydown: [],
    keyup: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
};

// export const getInput = (canvas: HTMLCanvasElement, dualView: boolean = false) => {
export const getInput = (canvas: HTMLCanvasElement) => {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonHeld: Record<number, boolean> = {};
    const keyHeld: Record<string, boolean> = {};
    const mouse = {x: 0, y: 0, touchEnded: false};
    const touch = {x: 0, y: 0};

    canvas.addEventListener('mousedown', evt => {
        mouse.touchEnded = false;

        buttonHeld[evt.button] = true;
    });

    const setInput = (type: keyof typeof listeners, input: () => void) => {
        listeners[type].push(input);
    };

    canvas.addEventListener('mousemove', evt => {
        mouse.touchEnded = false;

        mouse.x = +(evt.clientX - canvasRect.left).toFixed(0);
        mouse.y = +(evt.clientY - canvasRect.top).toFixed(0);
    });

    canvas.addEventListener('mouseup', evt => {
        mouse.touchEnded = false;

        delete buttonHeld[evt.button];

        listeners.mouseup.forEach(m => m());
    });

    canvas.addEventListener('keydown', evt => {
        mouse.touchEnded = false;

        keyHeld[evt.code] = true;
    });

    canvas.addEventListener('keyup', evt => {
        mouse.touchEnded = false;

        delete keyHeld[evt.code];

        if (evt.code === 'F12') for (let i = 0; i < resizeCB.length; i++) consoleToggleCB[i]();

        listeners.mousedown.forEach(m => m());
    });

    canvas.addEventListener('touchstart', (evt: TouchEvent) => {
        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);
    });

    canvas.addEventListener('touchmove', (evt: TouchEvent) => {
        evt.preventDefault(); // prevents scrolling for example

        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);
    });

    canvas.addEventListener('touchend', (evt: TouchEvent) => {
        evt.preventDefault(); // otherwise mouse gets moved to touch spot, firing all other mouse events

        mouse.touchEnded = true;
    });

    const resize = () => {
        for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();
    };

    let timeout: ReturnType<typeof setTimeout>;

    // resize events are only fired on the window object (mdn mozilla)
    onresize = () => {
        clearTimeout(timeout);
        timeout = setTimeout(resize, 250);
    };

    const createInsideRect =
        (inputDevice: {x: number; y: number}) => (rect: {x: number; y: number; w: number; h: number}) =>
            inputDevice.x >= rect.x - rect.w / 2 &&
            inputDevice.x < rect.x + rect.w / 2 &&
            inputDevice.y >= rect.y - rect.h / 2 &&
            inputDevice.y < rect.y + rect.h / 2;

    return {
        mouse: Object.assign(mouse, {insideRect: createInsideRect(mouse)}),
        touch: Object.assign(touch, {insideRect: createInsideRect(touch)}),
        buttonHeld,
        keyHeld,
        setInput,
    };
};

export const setResize = (cbjh: () => unknown) => resizeCB.push(cbjh);

export const setConsoleToggle = (cbs: () => unknown) => consoleToggleCB.push(cbs);
