import {uid} from './helpers';
import {createDualView} from './dualview';
import statistics from './statistics';
import type {CanvasOptions, Resources, StatisticCanvasOptions, StatisticInitializeResource} from './types';
import type {Engine} from './types/engine';

// Give these all the canvasoptions that setCanvasOptions also has (make it into 1) and itterate over them to set
const defaultCanvasOptions = {
    bgColor: '#444',
};

export const getCanvas = (options?: {width?: number; height?: number; contextMenu?: boolean; bgColor?: string}) => {
    const canvasOptions = {...options, ...defaultCanvasOptions};

    const canvas = document.createElement('canvas');

    if (canvasOptions.contextMenu)
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();

            return false;
        });

    if (canvasOptions.width) canvas.width = canvasOptions.width;
    if (canvasOptions.height) canvas.width = canvasOptions.height;
    if (canvasOptions.bgColor) canvas.style.backgroundColor = canvasOptions.bgColor;

    return canvas;
};

export const getContext2D = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get 2D context from canvas");

    return context;
};

const setCanvasOptions = (canvas: HTMLCanvasElement, options?: CanvasOptions) => {
    if (!options) return;

    // Refactor into switch and auto execute options
    if (options.full) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
    if (options.width && !options.full) canvas.width = options.width;
    if (options.height && !options.full) canvas.height = options.height;
    if (options.bg) canvas.style.backgroundColor = options.bg;
};

export const createContainer = (id?: string) => {
    const container = document.createElement('div');

    container.setAttribute('id', id ?? `container-${uid()}`);

    return container;
};

export const getContainer = (containerID: string) => {
    const container = document.getElementById(containerID);

    if (!(container instanceof HTMLDivElement)) throw new Error(`can't find div with id '${containerID}'`);

    return container;
};

export const setContainer = (canvas: HTMLCanvasElement, container: HTMLDivElement) => {
    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.appendChild(canvas);
};

export const setCanvas = (
    id: number | string,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    engine: Engine,
    container: HTMLDivElement,
    options?: CanvasOptions,
): void => {
    // Container could/should be optional
    setContainer(canvas, container);

    setCanvasOptions(canvas, options);

    // These belong to setCanvasOptions aswell offcourse
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
        let key: keyof StatisticCanvasOptions;

        for (key in options.statistics) {
            statSwitch[key](statResources);
        }
    }
};

const statSwitch: Record<keyof StatisticCanvasOptions, (resource: StatisticInitializeResource) => void> = {
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

        statistics.run(id);
    },
    toggleKey: ({id, toggleKey}) => statistics.setToggleKey(id, toggleKey),
};
