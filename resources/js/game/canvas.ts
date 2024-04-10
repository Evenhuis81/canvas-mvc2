import type {CanvasOptions} from './types';

export const setCanvas = (options: CanvasOptions) => {
    const canvas = document.createElement('canvas');

    setCanvasOptions(canvas, options);

    return canvas;
};

export const getContext2d = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get context2d from canvas");

    return context;
};

const setCanvasOptions = (canvas: HTMLCanvasElement, options: CanvasOptions) => {
    canvas.width = options.width;
    canvas.height = options.height;
    canvas.style.backgroundColor = options.backgroundColor;

    const container = getContainer();

    if (options.position === 'center') {
        container.style.display = 'flex';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    }

    container.appendChild(canvas);

    document.body.appendChild(container);
};

const getContainer = () => {
    const container = document.getElementById('container');

    if (!(container instanceof HTMLDivElement)) throw new Error("can't find div with id container");

    return container;
};
