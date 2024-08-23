import {uid} from './helpers';
import type {Show} from './types/engine';
import {vector} from './vector';

// This should become a reesource, but with different 'themes' or statistic variants. (for different kind of options)
// Create text object according to StaticView, with calculated options (like button, possible to 'lend' those)
export const statistics: Record<string | number, Statistic[]> = {};

export const setStatistics = (id: string | number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const set = (statistic: Statistic) => statistics[id].push(statistic);

    return {
        set,
        show: createShow(id, context, canvas),
    };
};

// const setFn = (fn: () => string) => {
//     statistics.push({
//         id: 0,
//         name: 'set property',
//         fn,
//     });
// };

const createShow = (id: number | string, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const txtPosDefault = vector(10, 10);
    let txtPos = vector(10, 10);
    const txtMargin = 5;

    return {
        id,
        name: `${id}-statistics show`,
        fn: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px monospace';
            ctx.fillStyle = '#fff';

            //         for (let i = 0; i < statistics.length; i++) {
            //             const txt = statistics[i].fn();

            //             const metrics = ctx.measureText(txt);

            //             const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; // static
            //             // const actualHeight = metrics.actualBoundingBoxAscent +
            //             // metrics.actualBoundingBoxDescent; // depend on txt

            //             ctx.fillText(txt, txtPos.x + metrics.width / 2, txtPos.y + fontHeight / 2);

            //             // ctx.lineWidth = 1;
            //             // ctx.strokeStyle = '#f00';
            //             // ctx.beginPath();
            //             // ctx.strokeRect(txtPos.x, txtPos.y, ctx.measureText(txt).width, fontHeight);

            //             txtPos.y += fontHeight + txtMargin;
            //         }

            //         txtPos = {...txtPosDefault};
        },
    };
};

type Statistic = {
    id: number;
    name: string;
    fn: () => string;
};

// interface StatisticsResource {
//     set: (stat: Statistic) => number;
//     setFn: (fn: () => string) => void;
//     show: Show;
// }
