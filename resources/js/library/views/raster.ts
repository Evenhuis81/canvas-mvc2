import {TransformedView} from 'library/types/views';

type RasterOptions = {
    lineWidth: number;
    strokeStyle: string;
    xUnits: number;
    yUnits: number;
};

const defaultOptions: RasterOptions = {
    lineWidth: 0.02,
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
            ctx.strokeStyle = options.strokeStyle;
            ctx.lineWidth = options.lineWidth * tv.scale.x;

            const topLeft = tv.screen2World(0, 0);
            const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();

            for (let y = 0; y < options.yUnits + 1; y++) {
                if (y > topLeft.yT && y < bottomRight.yT) tv.paint.line(0, y, options.xUnits, y);
            }

            for (let x = 0; x < options.xUnits + 1; x++) {
                if (x > topLeft.xT && x < bottomRight.xT) tv.paint.line(x, 0, x, options.yUnits);
            }

            ctx.stroke();
        },
    };
};
