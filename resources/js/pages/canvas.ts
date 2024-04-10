interface CanvasOptions {
    width: number;
    height: number;
    backgroundColor: string;
    position: string;
}

const setCanvasOptions = (canvas: HTMLCanvasElement, options: CanvasOptions) => {
    canvas.width = options.width;
    canvas.height = options.height;
    canvas.style.backgroundColor = options.backgroundColor;

    const container = getContainer();

    if (options.position === 'center') {
        //
    }

    document.body.appendChild(container);
};

export const setCanvas = (options: CanvasOptions) => {
    const controller = getController();

    setCanvasOptions(controller.canvas, options);

    return {context: controller.context};
};

const getContainer = () => {
    const container = document.getElementById('container');

    if (!(container instanceof HTMLDivElement)) throw new Error("can't find div with id container");

    return container;
};

const getController = () => {
    const canvas = document.createElement('canvas');

    const context = getContext2d(canvas);

    return {canvas, context};
};

const getContext2d = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get context2d from canvas");

    return context;
};

export const getCanvas = (id: string) => {
    const canvas = document.getElementById(id);

    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('not a valid canvas id');

    return canvas;
};
