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

            // Calculate starting tile visible on screen rounded to int (outside included if tile is on 'edge')
            const top = Math.floor(topLeft.yT);
            const left = Math.floor(topLeft.xT);
            const bottom = Math.ceil(bottomRight.yT);
            const right = Math.ceil(bottomRight.xT);

            if (last.top !== top || last.left !== left) {
                console.log('changed (T-L-B-R)', top, left, bottom, right);

                last.top = top;
                last.left = left;
                last.bottom = bottom;
                last.right = right;

                return;
            } else {
                // console.log('topLeft/BottomRight unchanged');
            }

            ctx.strokeStyle = defaultOptions.strokeStyle;
            ctx.lineWidth = defaultOptions.lineWidth * tv.scale.x;

            ctx.beginPath();

            // Temp: Just raster, later: any tileRaster
            let yTop = top >= 0 ? top : 0;
            let yBottom = bottom <= raster.length ? bottom : raster.length;
            let xLeft = left >= 0 ? left : 0;
            let xRight = right <= raster[0].length ? right : raster[0].length;

            // Already fit for tile, not lines
            let linesDrawnX = 0;
            let linesDrawnY = 0;

            for (let y = yTop; y < yBottom + 1; y++) {
                // if (y > topLeft.yT && y < bottomRight.yT) tv.paint.line(0, y, bottom, y);

                tv.paint.line(xLeft, y, xRight, y);

                linesDrawnY++;
            }

            // ctx.stroke();

            // ctx.beginPath();

            for (let x = xLeft; x < xRight + 1; x++) {
                // if (x > topLeft.xT && x < bottomRight.xT) tv.paint.line(x, 0, x, defaultOptions.yUnits);

                tv.paint.line(x, yTop, x, yBottom);

                linesDrawnX++;
            }

            ctx.stroke();

            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';

            ctx.fillText(`lines Drawn X: ${linesDrawnX.toString()}`, 200, 120);
            ctx.fillText(`lines Drawn Y: ${linesDrawnY.toString()}`, 200, 150);
        },
    };
};
