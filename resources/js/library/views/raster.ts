import {TransformedView} from 'library/types/views';

// type RasterOptions = {
//     lineWidth: number;
//     strokeStyle: string;
//     xUnits: number;
//     yUnits: number;
// };

// const defaultOptions: RasterOptions = {
//     lineWidth: 0.02,
//     strokeStyle: '#aaa',
//     xUnits: 10,
//     yUnits: 10,
// };

const testRaster = [
    ['X', 'O', 'X'],
    ['O', 'X', 'O'],
    ['X', 'O', 'X'],
];

type Oh = {
    type: 'O';
    stroke: string;
};

type Ix = {
    type: 'X';
    fill: string;
};

const testTiles = {
    X: {
        type: 'X',
        fill: '#0f0',
    },
    O: {
        type: 'O',
        stroke: '#f00',
    },
};

export const createTileDraw = <O extends object>(
    ctx: CanvasRenderingContext2D,
    tv: TransformedView,
    tiles: {[T in keyof O]: O[T]},
    raster: Array<keyof O[]>,
    // rasterOptions?: Partial<RasterOptions>,
) => {
    // const options = {...defaultOptions, rasterOptions};

    // const t = raster[0][0];

    // const r = tiles[t]

    raster.forEach(r => {
        //
    });

    return {
        id: 'level-raster-draw',
        name: 'Level Raster Draw',
        fn: () => {
            // ctx.strokeStyle = options.strokeStyle;
            // ctx.lineWidth = options.lineWidth * tv.scale.x;

            const topLeft = tv.screen2World(0, 0);
            const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();

            // for (let y = 0; y < options.yUnits + 1; y++) {
            //     if (y > topLeft.yT && y < bottomRight.yT) tv.paint.line(0, y, options.xUnits, y);
            // }

            // for (let x = 0; x < options.xUnits + 1; x++) {
            //     if (x > topLeft.xT && x < bottomRight.xT) tv.paint.line(x, 0, x, options.yUnits);
            // }

            ctx.stroke();
        },
    };
};
