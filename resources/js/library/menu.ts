import {getCanvas} from 'library/canvas';
import {getContainer} from '.';

const canvas2 = getCanvas();
let canvas1: HTMLCanvasElement;
let container: HTMLDivElement;
let timeout: ReturnType<typeof setTimeout>;
let active = false;
const resizeCB: (() => void)[] = [];

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

export const onResize = (cb: () => void) => {
    resizeCB.push(cb);
};

export const setDualView = (canvas: HTMLCanvasElement, containerID: string) => {
    canvas1 = canvas;
    container = getContainer(containerID);
    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    canvas1.style.backgroundColor = '#000';
    canvas2.style.backgroundColor = '#111';

    resize();

    container.appendChild(canvas1);

    return canvas2;
};

const toggleDualView = () => {
    // Make this a transition, with target and bezier curve laid out transition effect
    if (active) {
        container.removeChild(canvas2);
        canvas1.width = innerWidth;

        active = false;

        for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();

        return;
    }

    canvas1.width = innerWidth / 2;
    canvas2.width = innerWidth / 2;

    container.appendChild(canvas2);

    active = true;

    // This is more like a manual resize, triggered by keyUp event
    for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();
};

const resize = () => {
    canvas1.height = innerHeight;
    canvas2.height = innerHeight;

    if (active) {
        canvas1.width = innerWidth / 2;
        canvas2.width = innerWidth / 2;

        for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();

        return;
    }

    canvas1.width = innerWidth;
    canvas2.width = innerWidth;

    for (let i = 0; i < resizeCB.length; i++) resizeCB[i]();
};
