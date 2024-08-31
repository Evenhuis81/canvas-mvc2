import {createContainer, getCanvas, getContainer, getContext2D, setCanvas} from './canvas';
import {getEngine} from './engine';
import {getTV} from './views/tv';
import {getInput} from 'library/input';
import {getSV} from './views/sv';
import {uid} from './helpers';
import {LibraryOptions, Resources} from './types';

export const resources: Record<string | number, Resources> = {};

export const initialize = (id?: string | number, options?: Partial<LibraryOptions>) => {
    const libraryID = id ?? uid();

    const canvas = getCanvas(options);
    const context = getContext2D(canvas);
    const engine = getEngine();

    if (options?.clear) clearOn(engine, context);

    const container = options?.containerID ? getContainer(options.containerID) : createContainer();

    setCanvas(libraryID, canvas, context, engine, container, options);

    // setStatistics();

    const input = getInput(canvas, options?.dualView);

    const tv = getTV(context, input);

    const sv = getSV(context, engine);

    resources[libraryID] = {id: libraryID, canvas, context, engine, container, sv, tv, input};

    return resources[libraryID];
};

export const getLibraryOptions = (context: CanvasRenderingContext2D, engine: Engine) => {
    const setClear = () => clearOn(engine, context);
    const setDot = () => dotOn(engine, context);
    const removeClear = () => clearOff(engine);
    const removeDot = () => dotOff(engine);

    return {
        setClear,
        setDot,
        removeClear,
        removeDot,
    };
};

const clearOn = (engine: Engine, context: CanvasRenderingContext2D) => {
    engine.setShow(clear(context));
};

const clearOff = (engine: Engine) => {
    engine.removeShow(0); // clear show id = 0
};

const dotOn = (engine: Engine, context: CanvasRenderingContext2D) => {
    engine.setShow(dotMiddle(context));
};

const dotOff = (engine: Engine) => {
    engine.removeShow(99); // dot show id = 99
};

const dotMiddle = (context: CanvasRenderingContext2D) => ({
    id: 99,
    name: 'dot in middle',
    fn: () => {
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(context.canvas.width / 2, context.canvas.height / 2, 2, 0, Math.PI * 2);
        context.fill();
    },
});

const clear = (context: CanvasRenderingContext2D) => ({
    id: 0,
    name: 'clearRect',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});

const setStatistics = (options: LibraryOptions) => {
    if (options?.statistics) {
        // ToggleKey default set to KeyT here, but ideally this should be optional. (this is outside the statistics module and default
        // should be set inside the module.)
        const statResources = {
            id,
            engine,
            context,
            canvas,
            container,
            toggleKey: options.statistics.toggleKey ?? 'KeyT',
        };
        let key: keyof StatisticOptions;

        for (key in options.statistics) {
            statSwitch[key](statResources);
        }
    }
};

const statSwitch: Record<keyof StatisticOptions, (resource: StatisticInitializeResource) => void> = {
    // DualView and Statistics are together untill DualView gets multi purpose
    // Beware deactivated firing even when it has not yet become activated
    dualView: ({id, canvas, engine, container}) => {
        const {setListeners} = createDualView(id, canvas, engine, container);

        const onActivation = () => {
            console.log('activated');
        };

        const onDeactivation = () => {
            console.log('de-activated');
        };

        setListeners(onActivation, onDeactivation);
    },
    // When dualView is true, this should not be true
    overlay: ({id, canvas, context, engine}) => {
        statistics.create(id, canvas, context, engine);

        statistics.setFn(id, () => 'test stat');

        // statistics.run(id);
    },
    toggleKey: ({id, toggleKey}) => statistics.setToggleKey(id, toggleKey),
};
