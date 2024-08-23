import {uid} from './helpers';
import {setDualView} from './dualview';
import type {CanvasOptions} from './types';

export const getCanvas = (contextMenu: boolean = true) => {
    const canvas = document.createElement('canvas');

    if (contextMenu)
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();

            return false;
        });

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

export const setCanvas = (canvas: HTMLCanvasElement, options?: CanvasOptions): void => {
    const container = options?.containerID ? getContainer(options.containerID) : createContainer();

    // Container should be optional
    setContainer(canvas, container);

    setCanvasOptions(canvas, options);

    // DualView and Statistics go hand in hand at the moment, till DualView gets multi purpose
    if (options?.dualView) {
        setDualView(canvas, container);

        // setStatistics()
    }
};
