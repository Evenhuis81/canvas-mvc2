import {Pos} from 'library/types/shapes';
import {TransformedView} from 'library/types/views';

// type RasterOptions = {
//     lineWidth: number;
//     strokeStyle: string;
//     xUnits: number;
//     yUnits: number;
// };

const defaultOptions = {
    lineWidth: 0.02,
    strokeStyle: '#aaa',
    //     xUnits: 10,
    //     yUnits: 10,
};

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
    // tiles: {[T in keyof O]: O[T]},
    raster: Array<Array<keyof O>>,
    // tilesVisible: Pos = {x: 16, y: 9},
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
            const topLeft = tv.screen2World(0, 0);
            const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);

            // Calculate starting tile visible on screen
            const top = Math.floor(topLeft.yT);
            const left = Math.floor(topLeft.xT);
            const bottom = Math.floor(bottomRight.yT);
            const right = Math.floor(bottomRight.xT);

            if (last.top !== top || last.left !== left || last.bottom !== bottom || last.right !== right) {
                console.log('changed', top, left, bottom, right);

                last.top = top;
                last.left = left;
                last.bottom = bottom;
                last.right = right;

                return;
            } else {
                console.log('topLeft/BottomRight unchanged');
            }

            ctx.strokeStyle = defaultOptions.strokeStyle;
            ctx.lineWidth = defaultOptions.lineWidth * tv.scale.x;

            ctx.beginPath();

            for (let y = top; y < bottom; y++) {
                // if (y > topLeft.yT && y < bottomRight.yT) tv.paint.line(0, y, bottom, y);
                // tv.paint.line(, y, bottom, y);
            }

            for (let x = left; x < right; x++) {
                // if (x > topLeft.xT && x < bottomRight.xT) tv.paint.line(x, 0, x, defaultOptions.yUnits);
                // tv.paint.line(x, 0, x, );
            }

            ctx.stroke();
        },
    };
};
