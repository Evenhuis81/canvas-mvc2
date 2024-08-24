import {getCanvas} from 'library/canvas';
import {setConsoleToggle, setResize} from './input';
import {DualViewProperties} from './types';
import {Engine} from './types/engine';
import {createDualViewTransitionUpdate} from './button/transition';
import statistics from './statistics';

export const setDualView = (
    id: number | string,
    canvas: HTMLCanvasElement,
    engine: Engine,
    container: HTMLDivElement,
) => {
    const props = {
        id,
        canvas1: canvas,
        canvas2: getCanvas({width: 0, bgColor: '#333'}),
        container,
        active: false,
        transitioning: false,
    };

    setConsoleToggle(() => resize(props));

    // Initial resize
    resize(props);

    // Set resize method to input module
    setResize(() => resize(props));

    addEventListener('keyup', ({code}) => {
        if (code === 'KeyT') toggleDualView(props, engine);
    });

    return props.canvas2;
};

const toggleDualView = (props: DualViewProperties, engine: Engine) => {
    const {canvas1, canvas2, container} = props;

    // Boolean is for when the transition is actually finished so the container can safely be removed.
    const finish = (finished = false) => {
        engine.removeUpdate('dualview-transition');

        props.transitioning = false;

        if (finished && !props.active) {
            container.removeChild(canvas2);

            return;
        }

        if (finished) statistics.run(props.id);
    };

    if (props.transitioning) finish();

    if (props.active) {
        engine.setUpdate(createDualViewTransitionUpdate(canvas1, {width: innerWidth}, canvas2, {width: 0}, finish));

        props.transitioning = true;
        props.active = false;

        return;
    }

    container.appendChild(canvas2);

    engine.setUpdate(
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
    canvas2.width = innerWidth;
};
