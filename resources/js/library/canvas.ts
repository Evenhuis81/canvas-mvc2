export const getCanvas = () => {
    const canvas = document.createElement('canvas');

    // This could be an option
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

const setCanvasOptions = (canvas: HTMLCanvasElement, options: CanvasOptions, container?: HTMLDivElement) => {
    if (options.full) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
    if (options.width && !options.full) canvas.width = options.width;
    if (options.height && !options.full) canvas.height = options.height;
    if (options.backgroundColor) canvas.style.backgroundColor = options.backgroundColor;

    if (options.center) {
        // should not be needed when full is true, but with scaling you get a scroll bar otherwise
        if (!container) throw new Error('center option requires a container');

        container.style.display = 'flex';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        container.appendChild(canvas);

        return;
    }

    if (container) container.appendChild(canvas);
};

export type CanvasOptions = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    center?: boolean;
    full?: boolean; // full tab (innerWidth, innerHeight)
};

export const setCanvas = (canvas: HTMLCanvasElement, options?: CanvasOptions, container?: HTMLDivElement) => {
    if (options) return setCanvasOptions(canvas, options, container);

    // defaults
    console.log('canvas defaults are set (= just lightgray background');
    canvas.style.backgroundColor = '#888';
};

// const setCanvasDefaults = (canvas: HTMLCanvasElement, containerID?: string) => {
//     canvas.width = innerWidth;
//     canvas.height = innerHeight;
//     canvas.style.backgroundColor = '#000';

//     if (containerID) {
//         const container = getContainer;
//     }

//     container.style.display = 'flex';
//     container.style.width = '100vw';
//     container.style.height = '100vh';
//     container.style.justifyContent = 'center';
//     container.style.alignItems = 'center';

//     container.appendChild(canvas);
// };
