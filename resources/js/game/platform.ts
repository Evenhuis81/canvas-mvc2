export const getPlatform = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const size = {x: canvasWidth * 0.5, y: canvasHeight * 0.05};
    const pos = {x: canvasWidth / 2 - size.x / 2, y: canvasHeight * 0.75};

    const show = () => {
        context.fillStyle = '#00f';
        context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    return {show, pos, size};
};
