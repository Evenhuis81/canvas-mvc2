import type {BaseCircle, BaseRect, Pos, Shapes} from './types/shapes';
import type {NativeInputListener} from './types/input';

export type RemoveInputListener = () => void;
export type RunListener = () => void;

export type InputListenerHandler = [RunListener, RemoveInputListener];

const inputListeners: {[type: string]: any} = {};

const resizeCB: (() => void)[] = [];
const consoleToggleCB: (() => void)[] = [];
const listenerHandlers: {[type: string]: {[id: symbol]: InputListenerHandler}} = {};

export const getInput = (canvas: HTMLCanvasElement) => {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonHeld: Record<number, boolean> = {};
    const keyHeld: Record<string, boolean> = {};
    const mouse = {x: 0, y: 0};
    const touch = {x: 0, y: 0, ended: false};

    const addListener = <K extends keyof HTMLElementEventMap>(obj: NativeInputListener<K>) => {
        // TODO::Avoid adding every input listener as a seperate listener to the canvas, but make it so that a single
        // eventListener handles all types individually under that eventListener
        // canvas.addEventListener(obj.type, obj.listener);

        const id = obj.id ?? Symbol();

        listenerHandlers[obj.type][id] = [
            () => {
                addEventListener;
            }, // RunListener
            () => canvas.removeEventListener(obj.type, obj.listener), // RemoveEventListener
        ];

        return id;
    };

    const removeListener = (type: keyof HTMLElementEventMap, id: symbol) => {
        if (!listenerHandlers[type][id]) return false;

        listenerHandlers[type][id][0](); // RemoveEventListener

        delete listenerHandlers[type][id];

        return true;
    };

    canvas.addEventListener('mousedown', evt => {
        const mousedownListeners = listenerHandlers['mousedown'];

        touch.ended = false;

        buttonHeld[evt.button] = true;

        const values: InputListenerHandler[] = Object.values(mousedownListeners);

        values.forEach(val => {
            val[0]();
        });
        // for (const id in mousedownListeners) {
        //     mousedownListeners[id]
        // }

        // listeners.mousedown.forEach(m => {
        //     if (clickedInsideMouse(m.shape)) m.listener(evt);
        // });
    });

    canvas.addEventListener('mousemove', evt => {
        touch.ended = false;

        mouse.x = +(evt.clientX - canvasRect.left).toFixed(0);
        mouse.y = +(evt.clientY - canvasRect.top).toFixed(0);

        listeners.mousemove.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('mouseup', evt => {
        touch.ended = false;

        delete buttonHeld[evt.button];

        listeners.mouseup.forEach(m => {
            if (clickedInsideMouse(m.shape)) {
                // m.props.clicked = true;
                // m.props.clickTotal++;
                m.listener(evt);
            }
        });
    });

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
        touch.ended = false;

        keyHeld[evt.code] = true;

        listeners.keydown.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('keyup', evt => {
        touch.ended = false;

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

        touch.ended = true;

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
