export const createCharacter = (id: string, c: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Screen set to 16 x 9 (tiles width based on canvasWidth + tiles height based on width)
    const unit = canvas.width / 16;

    const char = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: 20,
        h: 20,
        vy: 3,
        fill: '#009',
        img: new Image(),
    };

    const draw = {
        id: `${id}-characterDraw`,
        name: 'draw character',
        fn: () => {
            c.beginPath();

            c.fillStyle = '#009';

            c.rect(char.x, char.y, char.w, char.h);
            c.fill();
        },
    };

    const update = {
        id: `${id}-characterUpdate`,
        name: 'update character',
        fn: () => {
            char.y += char.vy;
        },
    };

    canvas.addEventListener('keyup', ({code}) => {
        if (code === 'Space') char.vy = -char.vy;
    });

    return {draw, update};
};
