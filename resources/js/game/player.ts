export const getPlayer = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const size = {x: canvasWidth * 0.05, y: canvasHeight * 0.1};
    const pos = {x: canvasWidth / 2 - size.x / 2, y: canvasHeight / 2 - size.y / 2};
    const vel = {x: 0, y: 0};
    const acc = {x: 0, y: 0.5};

    const update = () => {
        vel.x += acc.x;
        vel.y += acc.y;
        pos.x += vel.x;
        pos.y += vel.y;
    };

    const show = () => {
        context.fillStyle = '#f00';
        context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    return {update, show, pos, size};
};
