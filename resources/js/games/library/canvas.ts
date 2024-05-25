export const getCanvas = () => {
    const canvas = document.createElement('canvas');

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();

        return false;
    });

    setDefaults(canvas);

    return canvas;
};

export const getContext2D = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!(context instanceof CanvasRenderingContext2D)) throw new Error("can't get context2d from canvas");

    return context;
};

const setDefaults = (canvas: HTMLCanvasElement) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.backgroundColor = '#000';

    const container = getContainer();

    container.style.display = 'flex';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    container.appendChild(canvas);

    document.body.appendChild(container);
};

const getContainer = () => {
    const container = document.getElementById('container');

    if (!(container instanceof HTMLDivElement)) throw new Error("can't find div with id container");

    return container;
};
