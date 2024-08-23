import {getCanvas} from 'library/canvas';
import {setConsoleToggle, setResize} from './input';
import {DualViewProperties} from './types';
import {Engine} from './types/engine';
import {createDualViewTransitionUpdate} from './button/transition';

export const setDualView = (canvas: HTMLCanvasElement, engine: Engine, container: HTMLDivElement) => {
    const props = {
        canvas1: canvas,
        canvas2: getCanvas(),
        container,
        active: false,
        transitioning: false,
    };
    props.canvas2.style.backgroundColor = '#333';
    props.canvas2.width = 0;

    setConsoleToggle(() => resize(props));

    // Initial resize
    resize(props);

    // Set resize method to input module
    setResize(() => resize(props));

    addEventListener('keyup', ({code}) => {
        if (code === 'KeyT') toggleDualView(props, engine);
    });
};

const toggleDualView = (props: DualViewProperties, engine: Engine) => {
    const {canvas1, canvas2, container} = props;

    const onFinished = (finished = false) => {
        engine.removeUpdate('dualview-transition');

        props.transitioning = false;

        if (finished && !props.active) container.removeChild(canvas2);
    };

    if (props.transitioning) onFinished();

    if (props.active) {
        engine.setUpdate(createDualViewTransitionUpdate(canvas1, {width: innerWidth}, canvas2, {width: 0}, onFinished));

        props.transitioning = true;
        props.active = false;

        return;
    }

    container.appendChild(canvas2);

    engine.setUpdate(
        createDualViewTransitionUpdate(canvas1, {width: innerWidth / 2}, canvas2, {width: innerWidth / 2}, onFinished),
    );

    props.transitioning = true;
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
