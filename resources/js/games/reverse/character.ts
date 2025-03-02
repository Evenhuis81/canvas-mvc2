import {WorldProperties} from '.';

export const createCharacter = (
    id: string,
    world: WorldProperties,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
) => {
    const char = {
        x: 9, // adjust with worldSpeed
        scaledX: 7 * world.unitScale + world.xOffset, // only a startposition, gets updated from character.update
        y: 7,
        scaledY: 2 * world.unitScale + world.yOffset,
        w: 1,
        scaledW: world.unitScale,
        h: 1,
        scaledH: world.unitScale,
        face: 'up',
        vy: 0.05,
        fill: '#009',
        // img: new Image(), // implement in a later stage
    };

    const draw = {
        id: `${id}-characterDraw`,
        name: 'draw character',
        fn: () => {
            c.fillStyle = '#009';

            c.beginPath();
            if (char.face === 'up') faceUp();
            else faceDown();
            c.fill();
        },
    };

    const faceUp = () => {
        c.moveTo(char.scaledX + char.scaledW / 2, char.scaledY);
        c.lineTo(char.scaledX + char.scaledW, char.scaledY + char.scaledH);
        c.lineTo(char.scaledX, char.scaledY + char.scaledH);
    };

    const faceDown = () => {
        c.moveTo(char.scaledX + char.scaledW / 2, char.scaledY + char.scaledH); //  + char.scaledH
        c.lineTo(char.scaledX + char.scaledW, char.scaledY); // -char.scaledH
        c.lineTo(char.scaledX, char.scaledY); // -char.scaledH
    };

    const update = {
        id: `${id}-characterUpdate`,
        name: 'update character',
        fn: () => {
            char.y += char.vy;

            char.scaledX = char.x * world.unitScale + world.xOffset;
            char.scaledY = char.y * world.unitScale + world.yOffset;
        },
    };

    canvas.focus();

    canvas.addEventListener('keyup', ({code}) => {
        if (code === 'Space') {
            char.vy = -char.vy;
            char.face = char.vy > 0 ? 'up' : 'down';
        }
    });

    return {draw, update, char};
};
