import {getCanvas} from 'library/canvas';
import {setResize} from './input';

export const setDualView = (canvas: HTMLCanvasElement, container: HTMLDivElement) => {
    let timeout: ReturnType<typeof setTimeout>;
    let active = false;

    const canvas2 = getCanvas();
    canvas2.style.backgroundColor = '#111';

    keyup(canvas, canvas2, active);

    resize(canvas, canvas2, active);

    setResize(resizeDualView);
};

const resizeDualView = () => {
    clearTimeout(timeout);
    timeout = setTimeout(resize, 250);
};

addEventListener('keydown', ({code}) => {
    if (code === 'KeyT') toggleDualView();
});

const keyup = (canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, active: boolean) => {
    addEventListener('keyup', ({code}) => {
        if (code === 'F11') resize(canvas1, canvas2, active);
    });
};

type DualViewProperties = {
    canvas1: HTMLCanvasElement;
    canvas2: HTMLCanvasElement;
};

const toggleDualView = (props: DualViewProperties) => {
    if (props) {
        container.removeChild(canvas2);
        canvas1.width = innerWidth;

        props = false;

        return;
    }

    canvas1.width = innerWidth / 2;
    canvas2.width = innerWidth / 2;

    container.appendChild(canvas2);

    props = true;
};

// This all applies to a 'fullscreen' canvas only
const resize = (canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, active: boolean) => {
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
