import {TransformedView} from 'library/types/views';

type RasterOptions = {
    scaledLineWidth: number;
    strokeStyle: string;
    xUnits: number;
    yUnits: number;
};

const defaultOptions: RasterOptions = {
    scaledLineWidth: 1,
    strokeStyle: '#aaa',
    xUnits: 10,
    yUnits: 10,
};

export const createRaster = (
    ctx: CanvasRenderingContext2D,
    tv: TransformedView,
    rasterOptions?: Partial<RasterOptions>,
) => {
    const options = {...defaultOptions, rasterOptions};

    return {
        id: 'level-raster-draw',
        name: 'Level Raster Draw',
        fn: () => {
            let linesDrawn = 0;

            ctx.strokeStyle = options.strokeStyle;
            // ctx.lineWidth = options.scaledLineWidth / tv.scale.x;
            ctx.lineWidth = 1;
            // console.log(tv.scale.x);

            ctx.beginPath();

            const topLeft = tv.screen2World(0, 0);
            const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);

            for (let y = 0; y < options.yUnits + 1; y++) {
                if (y > topLeft.yT && y < bottomRight.yT) {
                    tv.paint.line(0, y, options.xUnits, y);

                    linesDrawn++;
                }
            }

            for (let x = 0; x < options.xUnits + 1; x++) {
                if (x > topLeft.xT && x < bottomRight.xT) {
                    tv.paint.line(x, 0, x, options.yUnits);

                    linesDrawn++;
                }
            }

            ctx.stroke();

            console.log(linesDrawn);
        },
    };
};
