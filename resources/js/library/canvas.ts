import {uid} from './helpers';
import {CanvasOptions, LibraryOptions} from './types';

const defaultCanvasOptions = {
    backgroundColor: '#999',
    width: 300,
    height: 150,
    contextmenu: false,
};

export const setCanvas = (
    canvas: HTMLCanvasElement,
    container: HTMLDivElement,
    options?: Partial<LibraryOptions>,
): void => {
    setContainer(canvas, container);

    setLibraryOptions(canvas, options);
};

let count = 199;

export const getCanvas = (options?: Partial<CanvasOptions>) => {
    const canvasOptions = {...defaultCanvasOptions, ...options};

    const canvas = document.createElement('canvas');

    console.log(count++);

    canvas.tabIndex = count++; // no tabIndex = no focus, prevents listeners from working on canvas
    canvas.focus();

    if (!canvasOptions.contextMenu) {
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();

            return false;
        });
    }

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

const setLibraryOptions = (canvas: HTMLCanvasElement, options?: Partial<LibraryOptions>) => {
    if (!options) return;

    // Refactor into switch and auto execute options, thus expand options
    if (options.full) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
};

export const createContainer = (id?: string | number) => {
    const container = document.createElement('div');

    container.setAttribute('id', id ? `${id}-container` : `${uid()}-container`);

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
