import {getCanvas} from 'games/library/canvas';

const canvas2 = getCanvas();
let canvas1: HTMLCanvasElement;
let container: HTMLDivElement;
let timeout: ReturnType<typeof setTimeout>;
let active = false;

// create methods and use resource store
export const initializeMenu = (canvas: HTMLCanvasElement, divContainer: HTMLDivElement) => {
    setDualView(canvas, divContainer);
};

// resize events are only fired on the window object (mdn mozilla)
onresize = () => resizeDualView();

addEventListener('keydown', ({code}) => {
    if (code === 'KeyT') toggleDualView();
});

addEventListener('keyup', ({code}) => {
    if (code === 'F11') resize();
});

const resizeDualView = () => {
    clearTimeout(timeout);
    timeout = setTimeout(resize, 250);
};

const setDualView = (canvas: HTMLCanvasElement, divContainer: HTMLDivElement) => {
    canvas1 = canvas;
    container = divContainer;
    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    canvas1.style.backgroundColor = '#000';
    canvas2.style.backgroundColor = '#888';

    resize();

    container.appendChild(canvas1);
};

const toggleDualView = () => {
    if (active) {
        container.removeChild(canvas2);
        canvas1.width = innerWidth;

        active = false;

        return;
    }

    canvas1.width = innerWidth / 2;
    canvas2.width = innerWidth / 2;

    container.appendChild(canvas2);

    active = true;
};

const resize = () => {
    canvas1.height = innerHeight;
    canvas2.height = innerHeight;

    if (active) {
        canvas1.width = innerWidth / 2;
        canvas2.width = innerWidth / 2;

        return;
    }

    canvas1.width = innerWidth;
    canvas2.width = innerWidth;
};
