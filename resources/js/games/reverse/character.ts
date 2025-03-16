import {CreateElement, Entity} from 'library/entity';
import {WorldProperties} from '.';
import {level1} from './level1';
import {ShapeMap} from 'library/entity/defaults/shapes';

export const createCharacter = (
    id: string,
    world: WorldProperties,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    createElement: CreateElement<ShapeMap>,
) => {
    const char = {
        pos: {
            x: 9, // adjust with worldSpeed
            y: 7,
        },
        scaledX: 7 * world.unitScale + world.xOffset, // only a startposition, gets updated from character.update
        scaledY: 2 * world.unitScale + world.yOffset,
        w: 1,
        scaledW: world.unitScale,
        h: 1,
        scaledH: world.unitScale,
        move: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        face: 'up',
        grounded: true,
        vx: 0.05,
        vy: 0.05,
        fill: '#009',
        // img: new Image(), // implement in a later stage
        errorSet: false,
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

    // const colT = createElement('text', {
    //     text: 'COLLIDE',
    //     fontSize: 32,
    //     textFill: '#f00',
    //     x: canvas.width / 2,
    //     y: canvas.height / 2,
    // });

    const update = {
        id: `${id}-characterUpdate`,
        name: 'update character',
        fn: () => {
            //
            if (!char.grounded) {
                char.pos.y += char.vy;

                // Mind the +1, if char is between tiles, it fails.
                if (
                    char.face === 'down' &&
                    level1[Math.floor(char.pos.y)][Math.floor(char.pos.x - world.xOffset + 0.99)] === 'X'
                ) {
                    char.grounded = true;
                    char.pos.y = Math.floor(char.pos.y + 0.99);
                } else if (
                    char.face === 'up' &&
                    level1[Math.floor(char.pos.y + 1)][Math.floor(char.pos.x - world.xOffset + 0.99)] === 'X'
                ) {
                    char.grounded = true;
                    char.pos.y = Math.floor(char.pos.y);
                }
            }

            // +1 will fail in certain situations
            if (
                level1[Math.floor(char.pos.y)][Math.floor(char.pos.x - world.xOffset + 0.99)] === 'X' ||
                level1[Math.floor(char.pos.y + 0.99)][Math.floor(char.pos.x - world.xOffset + 0.99)] === 'X'
            ) {
                char.pos.x = Math.floor(char.pos.x + world.xOffset);
            }

            char.scaledX = char.pos.x * world.unitScale + world.xOffset;
            char.scaledY = char.pos.y * world.unitScale + world.yOffset;
        },
    };

    canvas.focus();

    canvas.addEventListener('keyup', ({code}) => {
        if (code === 'Space' && char.grounded) {
            // See comment in update, can be fixed here with a check before 'ungrounding'.
            // Needs a different check while not gorounded? (depends on playstyle)
            char.vy = -char.vy;
            char.grounded = false;
            char.face = char.vy > 0 ? 'up' : 'down';
        }
    });

    return {draw, update, char};
};
