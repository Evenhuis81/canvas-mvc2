import type {WorldProperties} from '.';
import type {ReverseLevel} from './level';

export const createCharacter = (
    world: WorldProperties,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    level: ReverseLevel,
) =>
    // createElement: CreateElement<ShapeMap>,
    {
        const getStartPos = () => {
            let x = -1;
            let y = -1;

            y = level.map.findIndex(levelY => {
                const iX = levelY.findIndex(levelX => levelX === 'S');

                x = iX;

                return iX !== -1;
            });

            return {x, y};
        };

        const pos = getStartPos();

        console.log(pos);

        const char = {
            scaledX: 7 * world.unitScale + world.xOffset,
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
            level,
        };

        const setLevel = (lvl: ReverseLevel) => (char.level = lvl);

        const draw = {
            id: `reverse-character-draw`,
            name: 'Draw Character',
            fn: () => {
                c.fillStyle = '#009';

                c.beginPath();

                char.face === 'up' ? faceUp() : faceDown();

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
            id: `reverse-character-update`,
            name: 'Update Character',
            fn: () => {
                // if (!char.grounded) {
                //     pos.y += char.vy;

                //     if (
                //         char.face === 'down' && // = going up
                //         char.level.getTile(Math.floor(pos.x + world.xOffset + 0.9), Math.floor(pos.y)) === 'X'
                //     ) {
                //         char.grounded = true;
                //         pos.y = Math.floor(pos.y + 1);
                //     } else if (
                //         char.face === 'up' && // = going down
                //         char.level.getTile(Math.floor(pos.x + world.xOffset + 0.9), Math.floor(pos.y + 1)) === 'X'
                //     ) {
                //         char.grounded = true;
                //         pos.y = Math.floor(pos.y);
                //     }
                // }

                // Side movement check, grounded not important
                // if (
                //     char.level.getTile(Math.floor(pos.x + world.xOffset + 0.9), Math.floor(pos.y)) === 'X' ||
                //     char.level.getTile(Math.floor(pos.x + world.xOffset + 0.9), Math.floor(pos.y + 0.9)) === 'X'
                // ) {
                //     pos.x = Math.floor(pos.x + world.xOffset);
                // }

                char.scaledX = pos.x * world.unitScale;
                char.scaledY = pos.y * world.unitScale;
            },
        };

        // TODO::Fix this in library
        canvas.focus();

        canvas.addEventListener('keyup', ({code}) => {
            if (code === 'Space' && char.grounded) {
                // See comment in update, can be fixed here with a check before 'ungrounding'.
                // Needs a different check while not gorounded? (depends on playstyle)
                char.vy = -char.vy;
                char.grounded = false;
                char.face = char.vy > 0 ? 'up' : 'down';

                console.log(char.face);
            }
        });

        return {draw, update, char, pos, setLevel};
    };

// TODO::Make this convenient in input library
// if (char.move.up) char.pos.y -= char.vy;
// if (char.move.down) char.pos.y += char.vy;
// if (char.move.left) char.pos.x -= char.vx;
// if (char.move.right) char.pos.x += char.vx;

// canvas.addEventListener('keydown', ({code}) => {
//     if (code === 'KeyW') char.move.up = true;
//     else if (code === 'KeyS') char.move.down = true;
//     else if (code === 'KeyA') char.move.left = true;
//     else if (code === 'KeyD') char.move.right = true;
// });

// if (code === 'KeyW') char.move.up = false;
// else if (code === 'KeyS') char.move.down = false;
// else if (code === 'KeyA') char.move.left = false;
// else if (code === 'KeyD') char.move.right = false;
