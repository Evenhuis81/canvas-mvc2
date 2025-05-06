import {Pos} from 'library/types/shapes';
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
    raster: Array<Array<keyof O>>,
    tilesVisible: Pos = {x: 16, y: 9},
    // rasterOptions?: Partial<RasterOptions>,
) => {
    // const options = {...defaultOptions, rasterOptions};

    if (!raster.length) throw Error('no tiles in raster, aborting...');

    // const tilesX = raster[0].length;
    // const tilesY = raster.length;

    const last = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    };

    return {
        id: 'tv-raster-draw',
        name: 'Transformed View Raster Draw',
        fn: () => {
            // ctx.strokeStyle = options.strokeStyle;
            // ctx.lineWidth = options.lineWidth * tv.scale.x;

            const topLeft = tv.screen2World(0, 0);
            const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);

            // ctx.beginPath();

            // Calculate starting tile visible on screen
            const top = Math.floor(topLeft.yT);
            const left = Math.floor(topLeft.xT);
            const bottom = Math.floor(bottomRight.yT);
            const right = Math.floor(bottomRight.xT);

            if (last.top !== top || last.left !== left || last.bottom !== bottom || last.right !== right) {
                console.log('changed', top, left, bottom, right);

                return;
            }

            console.log('topLeft/BottomRight unchanged');

            // for (let y = 0; y < options.yUnits + 1; y++) {
            //     if (y > topLeft.yT && y < bottomRight.yT) tv.paint.line(0, y, options.xUnits, y);
            // }

            // for (let x = 0; x < options.xUnits + 1; x++) {
            //     if (x > topLeft.xT && x < bottomRight.xT) tv.paint.line(x, 0, x, options.yUnits);
            // }

            // ctx.stroke();
        },
    };
};
