export const getPlatform = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const size = {x: canvasWidth * 0.8, y: canvasHeight * 0.05};
    const pos = {x: canvasWidth / 2 - size.x / 2, y: canvasHeight - size.y * 2};
    const vel = {x: canvasWidth / 2 - size.x / 2, y: canvasHeight - size.y * 2};
    const acc = {x: 0, y: 0};
    const fillColor = '#00f';

    const show = () => {
        context.fillStyle = fillColor;
        context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    return {show, pos, vel, acc, size};
};
