/* eslint-disable max-lines-per-function */
// import type {InputEventMap} from './types/entity';
import {BaseCircle, BaseRect, Pos, Shapes} from './types/shapes';
import type {InputListenersMap, NativeInputListener} from './types/input';
// Instead of just canvas element to add listeners, make this an option for any element or document

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

// export type SavedListeners = {
//     id: symbol;
//     listener: (evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => void;
// };

// const savedListeners: SavedListeners[] = [];
const removeListeners: {id: symbol; remove: () => void}[] = [];

export const getInput = (canvas: HTMLCanvasElement) => {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonHeld: Record<number, boolean> = {};
    const keyHeld: Record<string, boolean> = {};
    const mouse = {x: 0, y: 0, touchEnded: false};
    const touch = {x: 0, y: 0};

    const addListener = <K extends keyof HTMLElementEventMap>(obj: NativeInputListener<K>) => {
        canvas.addEventListener(obj.type, obj.listener);

        const remove = () => canvas.removeEventListener(obj.type, obj.listener);

        const id = obj.id ?? Symbol();

        removeListeners.push({id, remove});

        return id;
    };

    const removeListener = (id: symbol) => {
        const index = removeListeners.findIndex(l => l.id === id);

        // TODO::Add to Errorhandling module
        if (index === -1) return false;

        removeListeners[index].remove();

        removeListeners.splice(index, 1);

        return true;
    };

    canvas.addEventListener('mousedown', evt => {
        mouse.touchEnded = false;

        buttonHeld[evt.button] = true;

        listeners.mousedown.forEach(m => {
            if (clickedInsideMouse(m.shape)) m.listener(evt);
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
            if (clickedInsideMouse(m.shape)) {
                // m.props.clicked = true;
                // m.props.clickTotal++;
                m.listener(evt);
            }
        });
    });

    // TODO::Make prettier when scaled enough
    const clickedInsideMouse = (shape?: Shapes) => {
        if (!shape) return false;

        if (shape.type === 'rect' && insideMouseRect(shape)) return true;
        if (shape.type === 'circle' && insideMouseCircle(shape)) return true;

        return false;
    };
    const clickedInsideTouch = (shape?: Shapes) => {
        if (!shape) return false;

        if (shape.type === 'rect' && insideTouchRect(shape)) return true;
        if (shape.type === 'circle' && insideTouchCircle(shape)) return true;

        return false;
    };

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
            if (clickedInsideTouch(m.shape)) m.listener(evt);
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
            if (clickedInsideTouch(m.shape)) {
                // m.props.clicked = true;
                // m.props.clickTotal++;
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

    const distanceShape = (pos1: Pos, pos2: Pos) => {
        const pos1sq = Math.sqrt(pos1.x * pos1.x + pos1.y * pos1.y);
        const pos2sq = Math.sqrt(pos2.x * pos2.x + pos2.y * pos2.y);

        return pos1sq - pos2sq;
    };

    // TODO::Make generic when growing
    const insideMouse = (shape: Shapes) => {
        if (shape.type === 'rect') return insideMouseRect(shape);
        else if (shape.type === 'circle') return insideMouseCircle(shape);

        return;
    };

    const createInsideCircle = (inputDevice: Pos) => (circle: BaseCircle) => {
        const distance = distanceShape(inputDevice, circle);

        return distance <= circle.radius;
    };

    const createInsideRect = (inputDevice: {x: number; y: number}) => (rect: BaseRect) =>
        inputDevice.x >= rect.x - rect.w / 2 &&
        inputDevice.x < rect.x + rect.w / 2 &&
        inputDevice.y >= rect.y - rect.h / 2 &&
        inputDevice.y < rect.y + rect.h / 2;

    const insideMouseCircle = createInsideCircle(mouse);
    const insideTouchCircle = createInsideCircle(mouse);
    const insideMouseRect = createInsideRect(mouse);
    const insideTouchRect = createInsideRect(touch);

    return {
        mouse: Object.assign(mouse, {
            insideRect: insideMouseRect,
            insideCircle: insideMouseCircle,
            inside: insideMouse,
        }),
        touch: Object.assign(touch, {insideRect: insideTouchRect, insideCircle: insideTouchCircle}),
        buttonHeld,
        keyHeld,
        addListener,
        removeListener,
    };
};

export const setResize = (cbjh: () => unknown) => resizeCB.push(cbjh);

export const setConsoleToggle = (cbs: () => unknown) => consoleToggleCB.push(cbs);
