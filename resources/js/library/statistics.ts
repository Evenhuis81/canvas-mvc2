import {Statistic} from './types/statistics';
import {vector} from './vector';

const statistics: Statistic[] = [];

export const getStatistics = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const txtPosDefault = vector(10, 10);
    let txtPos = vector(10, 10);
    const txtMargin = 5;

    const show = {
        id: 8,
        name: 'enable statistics',
        fn: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = '16px OpenS';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';

            for (let i = 0; i < statistics.length; i++) {
                const txt = statistics[i].fn();

                const metrics = ctx.measureText(txt);

                const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; // static
                // const actualHeight = metrics.actualBoundingBoxAscent +
                // metrics.actualBoundingBoxDescent; // depend on txt

                ctx.beginPath();
                ctx.fillText(txt, txtPos.x + metrics.width / 2, txtPos.y + fontHeight / 2);

                // ctx.lineWidth = 1;
                // ctx.strokeStyle = '#f00';
                // ctx.beginPath();
                // ctx.strokeRect(txtPos.x, txtPos.y, ctx.measureText(txt).width, fontHeight);

                txtPos.y += fontHeight + txtMargin;
            }

            txtPos = {...txtPosDefault};
        },
    };

    const set = (statistic: Statistic) => statistics.push(statistic);

    return {set, setFn, show};
};

const setFn = (fn: () => string) => {
    statistics.push({
        id: 0,
        name: 'set property',
        fn,
    });
};
