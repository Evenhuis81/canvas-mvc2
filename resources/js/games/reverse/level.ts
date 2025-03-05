import {WorldProperties} from '.';
import {level1} from './level1';

export const createLevel = (ctx: CanvasRenderingContext2D, world: WorldProperties) => {
    const levelOffset = {
        x: 0,
    };
    const update = () => {
        levelOffset.x -= 0.05;
    };

    const draw = () => {
        ctx.fillStyle = 'red';

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 32; x++) {
                if (level1[y][x] === 'X') {
                    // console.log(levelOffset.x); // TODO::Add to statistics

                    ctx.beginPath();
                    ctx.rect(
                        x * world.unitScale + world.xOffset + levelOffset.x,
                        y * world.unitScale + world.yOffset,
                        world.unitScale,
                        world.unitScale,
                    );
                    ctx.fill();
                }
            }
        }
    };

    return {update, draw};
};
