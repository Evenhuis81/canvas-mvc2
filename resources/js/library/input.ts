import type {Circle, Pos, Rect} from './types/shapes';
import type {InputListener, InputListenerEventMap, InputListenerStore, InputShape} from './types/input';

const resizeCB: (() => void)[] = [];
const consoleToggleCB: (() => void)[] = [];

const buttonHeldMap: Record<number, boolean> = {};
const keyHeldMap: Record<string, boolean> = {};

let resizeTimeout: NodeJS.Timeout;

const getInputProperties = () => ({
    mouse: {
        x: 0,
        y: 0,
        buttonHeld: buttonHeldMap,
        pressCounter: 0,
    },
    keyboard: {
        keyHeld: keyHeldMap,
        pressCounter: 0,
    },
    touch: {
        x: 0,
        y: 0,
        ended: false,
        pushCounter: 0,
    },
});

const inputHandler: InputListenerStore = {
    mousedown: [],
    mousemove: [],
    mouseup: [],
    keydown: [],
    keyup: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
};

export const getCanvasInput = (canvas: HTMLCanvasElement) => {
    let canvasRect = canvas.getBoundingClientRect();
    const {mouse, keyboard, touch} = getInputProperties();

    const addMovement = (key: string, obj: Pos) => {
        //
    };

    const addListener = <K extends keyof InputListenerEventMap>(listener: InputListener<K>) =>
        inputHandler[listener.type].push(listener);

    const removeListener = (type: keyof InputListenerEventMap, id: symbol) => {
        const index = inputHandler[type].findIndex(input => input.id === id);

        if (index === -1) return false;

        inputHandler[type].splice(index, 1);

        return true;
    };

    canvas.addEventListener('mousedown', mouseEvent => {
        touch.ended = false;

        mouse.buttonHeld[mouseEvent.button] = true;

        inputHandler.mousedown.forEach(input => {
            if (input.shape && pressedInside(mouse, input.shape)) return input.listener(mouseEvent);

            if (!input.shape) input.listener(mouseEvent);
        });
    });

    canvas.addEventListener('mousemove', mouseEvent => {
        touch.ended = false;

        mouse.x = +(mouseEvent.clientX - canvasRect.left).toFixed(0);
        mouse.y = +(mouseEvent.clientY - canvasRect.top).toFixed(0);

        inputHandler.mousemove.forEach(input => input.listener(mouseEvent));
    });

    canvas.addEventListener('mouseup', mouseEvent => {
        touch.ended = false;

        delete mouse.buttonHeld[mouseEvent.button];

        mouse.pressCounter++;

        inputHandler.mouseup.forEach(m => {
            if (m.shape && pressedInside(mouse, m.shape)) return m.listener(mouseEvent);

            if (!m.shape) m.listener(mouseEvent);
        });
    });

    canvas.addEventListener('keydown', touchEvent => {
        touch.ended = false;

        keyboard.keyHeld[touchEvent.code] = true;

        inputHandler.keydown.forEach(input => input.listener(touchEvent));
    });

    canvas.addEventListener('keyup', keyboardEvent => {
        touch.ended = false;

        delete keyboard.keyHeld[keyboardEvent.code];

        if (keyboardEvent.code === 'F12') for (let i = 0; i < resizeCB.length; i++) consoleToggleCB[i]();

        inputHandler.keyup.forEach(input => input.listener(keyboardEvent));
    });

    canvas.addEventListener('touchstart', touchEvent => {
        touch.x = +(touchEvent.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(touchEvent.touches[0].clientY - canvasRect.top).toFixed(0);

        inputHandler.touchstart.forEach(m => {
            if (m.shape && pressedInside(touch, m.shape)) return m.listener(touchEvent);

            if (!m.shape) m.listener(touchEvent);
        });
    });

    canvas.addEventListener('touchmove', touchEvent => {
        touchEvent.preventDefault(); // prevents scrolling and more

        touch.x = +(touchEvent.touches[0].clientX - canvasRect.left).toFixed(0);
        touch.y = +(touchEvent.touches[0].clientY - canvasRect.top).toFixed(0);

        inputHandler.touchmove.forEach(input => input.listener(touchEvent));
    });

    canvas.addEventListener('touchend', (touchEvent: TouchEvent) => {
        touchEvent.preventDefault(); // prevents moving mouse to touch spot and firing all other mouse events

        touch.ended = true;

        mouse.pressCounter++;

        inputHandler.touchend.forEach(input => {
            if (input.shape && pressedInside(touch, input.shape)) return input.listener(touchEvent);

            if (!input.shape) input.listener(touchEvent);
        });
    });

    const resize = () => {
        canvasRect = canvas.getBoundingClientRect();

        for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();
    };

    // resize events are only fired on the window object (mdn mozilla)
    onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 250);
    };

    return {
        mouse: Object.assign(mouse, {
            insideShape: (shape: InputShape) => pressedInside(mouse, shape),
        }),
        touch: Object.assign(touch, {insideShape: (shape: InputShape) => pressedInside(touch, shape)}),
        addMovement,
        addListener,
        removeListener,
        keyboard,
    };
};

export const setResize = (cbjh: () => unknown) => resizeCB.push(cbjh);

export const setConsoleToggle = (cbs: () => unknown) => consoleToggleCB.push(cbs);

const pressedInside = (inputPos: Pos, shape: InputShape) => {
    if (shape.inputType === 'rect' && insideRect(inputPos, shape)) return true;
    if (shape.inputType === 'circle' && insideCircle(inputPos, shape)) return true;

    return false;
};

const insideRect = (inputPos: Pos, rect: Rect) =>
    inputPos.x >= rect.x - rect.w / 2 &&
    inputPos.x < rect.x + rect.w / 2 &&
    inputPos.y >= rect.y - rect.h / 2 &&
    inputPos.y < rect.y + rect.h / 2;

const insideCircle = (inputPos: Pos, circle: Circle) => {
    const distance = distanceShape(inputPos, circle);

    return distance <= circle.radius;
};

const distanceShape = (pos1: Pos, pos2: Pos) => {
    const pos1sq = Math.sqrt(pos1.x * pos1.x + pos1.y * pos1.y);
    const pos2sq = Math.sqrt(pos2.x * pos2.x + pos2.y * pos2.y);

    return pos1sq - pos2sq;
};
