import {uid} from './helpers';
import {createDualView} from './dualview';
import statistics from './statistics';
import type {CanvasOptions, LibraryOptions, StatisticOptions} from './types';

const defaultCanvasOptions = {
    backgroundColor: '#999',
    width: 300,
    height: 150,
    contextmenu: false,
};

export const getCanvas = (options?: Partial<CanvasOptions>) => {
    const canvasOptions = {...defaultCanvasOptions, ...options};

    const canvas = document.createElement('canvas');

    if (canvasOptions.contextMenu)
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();

            return false;
        });

    canvas.width = canvasOptions.width;
    canvas.height = canvasOptions.height;
    canvas.style.backgroundColor = canvasOptions.backgroundColor;

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
    options?: LibraryOptions,
): void => {
    // Container could/should be optional
    setContainer(canvas, container);

    setCanvasOptions(canvas, options);
};
