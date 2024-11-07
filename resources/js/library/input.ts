import type {InputEventMap} from './types/entity';
import type {Input, InputListenersMap} from './types/input';

/* eslint-disable max-lines-per-function */
const resizeCB: (() => void)[] = [];
const consoleToggleCB: (() => void)[] = [];

const listeners: InputListenersMap = {
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

    const addListener: Input['addListener'] = (type, listener, props?, rect?) =>
        listeners[type].push({type, listener, props, rect});

    const removeListener = <T extends keyof InputListenersMap>(type: T) => {
        const index = listeners[type].findIndex(l => l.type === type);

        if (index === -1) {
            console.log('listener with index: ' + index + ' already removed');

            return;
        }

        listeners[type].splice(index, 1);
    };

    canvas.addEventListener('mousedown', evt => {
        mouse.touchEnded = false;

        buttonHeld[evt.button] = true;

        listeners.mousedown.forEach(m => {
            if (m.rect && insideMouseRect(m.rect)) m.listener(evt);
        });
    });
    canvas.addEventListener('mousemove', evt => {
        mouse.touchEnded = false;

        mouse.x = +(evt.clientX - canvasRect.left).toFixed(0);
        mouse.y = +(evt.clientY - canvasRect.top).toFixed(0);

        listeners.mousemove.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('mouseup', evt => {
        mouse.touchEnded = false;

        delete buttonHeld[evt.button];

        listeners.mouseup.forEach(m => {
            if (m.rect && m.props && insideMouseRect(m.rect)) {
                m.props.clicked = true;
                m.props.clickTotal++;
                m.listener(evt);
            }
        });
    });

    canvas.addEventListener('keydown', evt => {
        mouse.touchEnded = false;

        keyHeld[evt.code] = true;

        listeners.keydown.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('keyup', evt => {
        mouse.touchEnded = false;

        delete keyHeld[evt.code];

        if (evt.code === 'F12') for (let i = 0; i < resizeCB.length; i++) consoleToggleCB[i]();

        listeners.keyup.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('touchstart', (evt: TouchEvent) => {
        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);

        listeners.touchstart.forEach(m => {
            if (m.rect && insideTouchRect(m.rect)) m.listener(evt);
        });
    });

    canvas.addEventListener('touchmove', (evt: TouchEvent) => {
        evt.preventDefault(); // prevents scrolling for example

        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);

        listeners.touchmove.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('touchend', (evt: TouchEvent) => {
        evt.preventDefault(); // otherwise mouse gets moved to touch spot, firing all other mouse events

        mouse.touchEnded = true;

        listeners.touchend.forEach(m => {
            if (m.rect && m.props && insideTouchRect(m.rect)) {
                m.props.clicked = true;
                m.props.clickTotal++;
                m.listener(evt);
            }
        });
    });

    const resize = () => {
        for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();
    };

    let timeout: NodeJS.Timeout;

    // resize events are only fired on the window object (mdn mozilla)
    onresize = () => {
        clearTimeout(timeout);
        timeout = setTimeout(resize, 250);
    };

    type Rect = {x: number; y: number; w: number; h: number};

    const createInsideRect = (inputDevice: {x: number; y: number}) => (rect: Rect) =>
        inputDevice.x >= rect.x - rect.w / 2 &&
        inputDevice.x < rect.x + rect.w / 2 &&
        inputDevice.y >= rect.y - rect.h / 2 &&
        inputDevice.y < rect.y + rect.h / 2;

    const insideMouseRect = createInsideRect(mouse);
    const insideTouchRect = createInsideRect(touch);

    return {
        mouse: Object.assign(mouse, {insideRect: insideMouseRect}),
        touch: Object.assign(touch, {insideRect: insideTouchRect}),
        buttonHeld,
        keyHeld,
        addListener,
        removeListener,
    };
};

export const setResize = (cbjh: () => unknown) => resizeCB.push(cbjh);

export const setConsoleToggle = (cbs: () => unknown) => consoleToggleCB.push(cbs);
