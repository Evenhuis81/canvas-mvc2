import type {BaseCircle, BaseRect, Pos, Shape} from './types/shapes';
import type {InputListenerType, InputListener, InputListenerStorage} from './types/input';

const inputListeners: InputListenerStorage = {
    mousedown: [],
    mousemove: [],
    mouseup: [],
    keydown: [],
    keyup: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
};

const resizeCB: (() => void)[] = [];
const consoleToggleCB: (() => void)[] = [];

export const getInput = (canvas: HTMLCanvasElement) => {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonHeld: Record<number, boolean> = {};
    const keyHeld: Record<string, boolean> = {};
    const mouse = {x: 0, y: 0};
    const touch = {x: 0, y: 0, ended: false};

    const addListener = <K extends InputListenerType>(listener: InputListener<K>) =>
        inputListeners[listener.type].push(listener);

    const removeListener = (type: InputListenerType, id: symbol) => {
        const index = inputListeners[type].findIndex(l => l.id === id);

        if (index === -1) return false;

        inputListeners[type].splice(index, 1);

        return true;
    };

    canvas.addEventListener('mousedown', evt => {
        touch.ended = false;

        buttonHeld[evt.button] = true;

        inputListeners.mousedown.forEach(m => {
            if (clickedInsideMouse(m.shape)) m.listener(evt);
        });
    });

    canvas.addEventListener('mousemove', evt => {
        touch.ended = false;

        mouse.x = +(evt.clientX - canvasRect.left).toFixed(0);
        mouse.y = +(evt.clientY - canvasRect.top).toFixed(0);

        inputListeners.mousemove.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('mouseup', evt => {
        touch.ended = false;

        delete buttonHeld[evt.button];

        inputListeners.mouseup.forEach((m, index) => {
            if (clickedInsideMouse(m.shape)) {
                console.log(`clicked inside mouse ${index}`);
                // m.props.clicked = true;
                // m.props.clickTotal++;
                m.listener(evt);
            }
        });
    });

    const clickedInsideMouse = (shape: Shape) => {
        if (shape.type === 'rect' && insideMouseRect(shape)) return true;
        if (shape.type === 'circle' && insideMouseCircle(shape)) return true;

        return false;
    };
    const clickedInsideTouch = (shape: Shape) => {
        if (!shape) return false;

        if (shape.type === 'rect' && insideTouchRect(shape)) return true;
        if (shape.type === 'circle' && insideTouchCircle(shape)) return true;

        return false;
    };

    canvas.addEventListener('keydown', evt => {
        touch.ended = false;

        keyHeld[evt.code] = true;

        inputListeners.keydown.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('keyup', evt => {
        touch.ended = false;

        delete keyHeld[evt.code];

        if (evt.code === 'F12') for (let i = 0; i < resizeCB.length; i++) consoleToggleCB[i]();

        inputListeners.keyup.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('touchstart', (evt: TouchEvent) => {
        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);

        inputListeners.touchstart.forEach(m => {
            if (clickedInsideTouch(m.shape)) m.listener(evt);
        });
    });

    canvas.addEventListener('touchmove', (evt: TouchEvent) => {
        evt.preventDefault(); // prevents scrolling for example

        touch.x = +(evt.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(evt.touches[0].clientY - canvasRect.top).toFixed(0);

        inputListeners.touchmove.forEach(m => m.listener(evt));
    });

    canvas.addEventListener('touchend', (evt: TouchEvent) => {
        evt.preventDefault(); // otherwise mouse gets moved to touch spot, firing all other mouse events

        touch.ended = true;

        inputListeners.touchend.forEach(m => {
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

    const insideMouse = (shape: Shape) => {
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
