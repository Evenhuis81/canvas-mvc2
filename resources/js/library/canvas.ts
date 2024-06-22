export const getCanvas = () => {
    const canvas = document.createElement('canvas');

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();

        return false;
    });

    return canvas;
};

export const getContext2D = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get context2D from canvas");

    return context;
};

export type CanvasOptions = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    center?: boolean;
    full: boolean; // full tab (innerWidth, innerHeight)
    container?: HTMLDivElement;
};

const setCanvasOptions = (canvas: HTMLCanvasElement, options: CanvasOptions) => {
    if (options.width) canvas.width = options.width;
    if (options.height) canvas.height = options.height;
    if (options.backgroundColor) canvas.style.backgroundColor = options.backgroundColor;

    if (options.center) {
        if (!options.container) throw new Error('center option requires a container');
        const {container: ct} = options;

        ct.style.display = 'flex';
        ct.style.width = '100vw';
        ct.style.height = '100vh';
        ct.style.justifyContent = 'center';
        ct.style.alignItems = 'center';

        ct.appendChild(canvas);
    }
};

export const setCanvas = (canvas: HTMLCanvasElement, options?: CanvasOptions) => {
    if (options) setCanvasOptions(canvas, options);
};

export const setCanvasDefaults = (canvas: HTMLCanvasElement, containerID?: string) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.backgroundColor = '#000';

    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    container.appendChild(canvas);
};
