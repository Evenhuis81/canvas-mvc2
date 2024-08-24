import {uid} from './helpers';
import {setDualView} from './dualview';
import type {CanvasOptions} from './types';
import {Engine} from './types/engine';
import statistics from './statistics';

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
    engine: Engine,
    options?: CanvasOptions,
): void => {
    const container = options?.containerID ? getContainer(options.containerID) : createContainer();

    // Container could be optional
    setContainer(canvas, container);

    setCanvasOptions(canvas, options);

    // DualView and Statistics are together untill DualView gets multi purpose
    if (options?.dualView) {
        // Create hook for statistics called onActivation & onDeactivation

        // statistics.create(props.id, canvas2, context, engine);
        // statistics.run(props.id);
        // statistics.destroy(props.id);

        const onActivation = () => {
            console.log('activated');
        };

        const onDeactivation = () => {
            console.log('de-activated');
        };

        setDualView(id, canvas, engine, container, onActivation, onDeactivation);
    }
};
