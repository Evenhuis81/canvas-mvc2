import {WorldProperties} from '.';
import {level1} from './level1';

export const createLevel = (ctx: CanvasRenderingContext2D, world: WorldProperties) => {
    const update = () => {
        world.xOffset -= world.xSpeed * 2;
    };

    const draw = () => {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 32; x++) {
                if (level1[y][x] === 'X') {
                    ctx.beginPath();

                    ctx.roundRect(
                        (x + 0.2 + world.xOffset) * world.unitScale,
                        (y + 0.2 + world.yOffset) * world.unitScale,
                        world.unitScale * 0.6,
                        world.unitScale * 0.6,
                        3,
                    );

                    ctx.stroke();
                }
            }
        }
    };

    return {update, draw};
};
