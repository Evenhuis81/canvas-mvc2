import {WorldProperties} from '.';
import {level1} from './level1';

export const createLevel = (ctx: CanvasRenderingContext2D, world: WorldProperties) => {
    const update = () => {
        world.xOffset -= 0.01;
    };

    const draw = () => {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 32; x++) {
                if (level1[y][x] === 'X') {
                    ctx.beginPath();

                    ctx.roundRect(
                        0.2 + (x + world.xOffset) * world.unitScale,
                        0.2 + (y + world.yOffset) * world.unitScale,
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
