import {level1} from './level1';

export const createLevel = (ctx: CanvasRenderingContext2D, unitScale: number) => {
    const update = () => {
        //
    };

    const draw = () => {
        ctx.fillStyle = 'red';

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 32; x++) {
                if (level1[y][x] === 'X') {
                    ctx.beginPath();
                    ctx.rect(x * unitScale, y * unitScale, unitScale, unitScale);
                    ctx.fill();
                }
            }
        }
    };

    return {update, draw};
};
