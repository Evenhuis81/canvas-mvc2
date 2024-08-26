import {getCanvas, getContext2D} from 'library/canvas';
import {setConsoleToggle, setResize} from './input';
import {createDualViewTransitionUpdate} from './button/transition';
import type {DualViewProperties} from './types';
import type {Engine} from './types/engine';

// 1. Make this creatDualView seperate from setConsoleToggle and all under that, so that onActivation and onDeactivation can be set;
// 2. Check which method requirees which properties and sort them acoordingly;
// 3. Make it so that you can switch to canvas2 active only fullwidth / screen
export const createDualView = (
    id: number | string,
    canvas: HTMLCanvasElement,
    engine: Engine,
    container: HTMLDivElement,
) => {
    const canvas2 = getCanvas({width: 0, bgColor: '#333'});
    const context2 = getContext2D(canvas);

    const props = {
        id,
        canvas1: canvas,
        canvas2,
        context2,
        container,
        engine,
        active: false,
        transitioning: false,
        onActivation: () => {},
        onDeactivation: () => {},
    };

    const setListeners = (onActivation: () => void, onDeactivation: () => void) => {
        props.onActivation = onActivation;
        props.onDeactivation = onDeactivation;
    };

    setConsoleToggle(() => resize(props));

    // Initial resize
    resize(props);

    // Set resize method to input module
    setResize(() => resize(props));

    addEventListener('keyup', ({code}) => {
        if (code === 'KeyT') toggleDualView(props);
    });

    return {canvas2, context2, setListeners};
};

const toggleDualView = (props: DualViewProperties) => {
    const {canvas1, canvas2, container} = props;

    // Boolean is for when the transition is actually finished so the container can safely be removed.
    const finish = (finished = false) => {
        props.engine.removeUpdate('dualview-transition');

        props.transitioning = false;

        if (finished && !props.active) {
            container.removeChild(canvas2);

            props.onDeactivation();

            return;
        }

        if (finished) {
            props.onActivation();
        }
    };

    if (props.transitioning) finish();

    if (props.active) {
        props.engine.setUpdate(
            createDualViewTransitionUpdate(canvas1, {width: innerWidth}, canvas2, {width: 0}, finish),
        );

        props.transitioning = true;
        props.active = false;

        return;
    }

    container.appendChild(canvas2);

    props.engine.setUpdate(
        createDualViewTransitionUpdate(canvas1, {width: innerWidth / 2}, canvas2, {width: innerWidth / 2}, finish),
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
    canvas2.width = 0;
};
