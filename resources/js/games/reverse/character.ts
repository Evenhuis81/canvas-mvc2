import {Pos} from 'library/types/shapes';
import type {WorldProperties} from '.';
import type {ReverseLevel} from './level';

const groundCheck = (level: ReverseLevel, x: number, y: number): boolean => level.getTile(x, y) === 'X';

export const createCharacter = (
    world: WorldProperties,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    level: ReverseLevel,
) =>
    // createElement: CreateElement<ShapeMap>,
    {
        const pos = level.startPos(level.map);

        const char = {
            scaledX: pos.x * world.unitScale,
            scaledY: pos.y * world.unitScale,
            w: 1,
            scaledW: world.unitScale,
            h: 1,
            scaledH: world.unitScale,
            face: 'up',
            grounded: groundCheck(level, pos.x, pos.y + 1),
            vx: 0.05,
            vy: 0.05,
            fill: '#009',
            level,
        };

        if (!char.grounded) char.face = 'down';

        if (pos.x === -1 || pos.y === -1) throw Error('Player Start Position not found on level map');

        // Positioning player in middle and shifting world view with same amount
        const middleMapX = Math.floor(world.xUnits / 2);
        const xDiff = middleMapX - pos.x;
        world.xOffset += xDiff;
        pos.x += xDiff;

        const setLevel = (lvl: ReverseLevel) => {
            char.level = lvl;

            const newStartPosition = level.startPos(level.map);

            pos.x = newStartPosition.x;
            pos.y = newStartPosition.y;

            char.scaledX = pos.x * world.unitScale;
            char.scaledY = pos.y * world.unitScale;

            char.grounded = groundCheck(level, pos.x, pos.y + 1);
        };

        const draw = {
            id: `reverse-character-draw`,
            name: 'Draw Character',
            fn: () => {
                ctx.fillStyle = '#009';

                ctx.beginPath();

                char.face === 'up' ? faceUp() : faceDown();

                ctx.fill();
            },
        };

        const faceUp = () => {
            ctx.moveTo(char.scaledX + char.scaledW / 2, char.scaledY);
            ctx.lineTo(char.scaledX + char.scaledW, char.scaledY + char.scaledH);
            ctx.lineTo(char.scaledX, char.scaledY + char.scaledH);
        };

        const faceDown = () => {
            ctx.moveTo(char.scaledX + char.scaledW / 2, char.scaledY + char.scaledH); //  + char.scaledH
            ctx.lineTo(char.scaledX + char.scaledW, char.scaledY); // -char.scaledH
            ctx.lineTo(char.scaledX, char.scaledY); // -char.scaledH
        };

        let lastWorldOffsetX = world.xOffset;
        let xInterval = 0;

        const update = {
            id: `reverse-character-update`,
            name: 'Update Character',
            fn: () => {
                xInterval = world.xOffset - lastWorldOffsetX;
                lastWorldOffsetX = world.xOffset;

                pos.y += char.vy;

                // X Movement Check, before Y check, else it may 'snap' into unwanted position
                if (
                    char.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y)) === 'X' ||
                    char.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
                ) {
                    // This needs deltatime to be accurate
                    // pos.x -= xInterval;
                }

                if (
                    char.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y + 0.95)) === 'X' ||
                    char.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
                ) {
                    char.grounded = true;
                    char.face = 'up';
                    pos.y = Math.floor(pos.y);
                }

                if (
                    char.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y)) === 'X' ||
                    char.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y)) === 'X'
                ) {
                    char.grounded = true;
                    char.face = 'down';
                    pos.y = Math.floor(pos.y + 1);
                }

                char.scaledX = pos.x * world.unitScale;
                char.scaledY = pos.y * world.unitScale;
            },
        };

        canvas.addEventListener('keyup', ({code}) => {
            if (code === 'Space' && char.grounded) {
                // See comment in update, can be fixed here with a check before 'ungrounding'.
                // Needs a different check while not gorounded? (depends on playstyle)
                char.vy = -char.vy;
                char.grounded = false;
                char.face = char.vy > 0 ? 'down' : 'up';
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
