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

export const setCanvasDefaults = (canvas: HTMLCanvasElement, container: HTMLDivElement) => {
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
