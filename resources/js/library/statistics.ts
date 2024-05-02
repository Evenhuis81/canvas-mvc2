import {gameStore} from '../tombraid/store';
import {vector} from './canvas';

const statistics: (() => string)[] = [];

export const setStatistic = (statistic: () => string) => {
    statistics.push(statistic);
};

const txtPosDefault = vector(10, 10);
const txtPos = vector(10, 10);
const txtMargin = 5;

export const enableStatistics = () => {
    const {context: ctx} = gameStore.state;

    const show = () => {
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';

        for (let i = 0; i < statistics.length; i++) {
            const txt = statistics[i]();

            const metrics = ctx.measureText(txt);

            const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; // static
            // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent; // depend on txt

            // ctx.beginPath();
            ctx.fillText(txt, txtPos.x + metrics.width / 2, txtPos.y + fontHeight / 2);

            // ctx.lineWidth = 1;
            // ctx.strokeStyle = '#f00';
            // ctx.beginPath();
            // ctx.strokeRect(txtPos.x, txtPos.y, ctx.measureText(txt).width, fontHeight);

            txtPos.y += fontHeight + txtMargin;
        }

        txtPos.set(txtPosDefault);
    };

    gameStore.state.engine.setShow(show);
};

export const disableShow = () => {
    //
};
