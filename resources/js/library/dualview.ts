import {getCanvas} from 'library/canvas';
import {setConsoleToggle, setResize} from './input';
import {DualViewProperties} from './types';

export const setDualView = (canvas: HTMLCanvasElement, container: HTMLDivElement) => {
    const props = {
        canvas1: canvas,
        canvas2: getCanvas(),
        container,
        active: false,
    };
    props.canvas2.style.backgroundColor = '#111';

    setConsoleToggle(() => resize(props));

    // Initial resize
    resize(props);

    // Set resize method to input module
    setResize(() => resize(props));

    addEventListener('keyup', ({code}) => {
        if (code === 'KeyT') toggleDualView(props);
    });
};

const toggleDualView = (props: DualViewProperties) => {
    const {canvas1, canvas2, container} = props;

    if (props.active) {
        container.removeChild(canvas2);
        canvas1.width = innerWidth;

        props.active = false;

        return;
    }

    canvas1.width = innerWidth / 2;
    canvas2.width = innerWidth / 2;

    container.appendChild(canvas2);

    props.active = true;
};

// This all applies to a 'fullscreen' canvas only
const resize = (props: DualViewProperties) => {
    const {canvas1, canvas2} = props;

    canvas1.height = innerHeight;
    canvas2.height = innerHeight;

    if (props.active) {
        canvas1.width = innerWidth / 2;
        canvas2.width = innerWidth / 2;

        return;
    }

    canvas1.width = innerWidth;
    canvas2.width = innerWidth;
};
