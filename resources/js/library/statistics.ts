import {uid} from './helpers';
import {vector} from './vector';
import {resources} from '.';
import {Statistic, StatisticResource} from './types/statistics';

const statisticsResource: Record<string | number, StatisticResource> = {};
const toggleKey: Record<string | number, string> = {};

export default {
    create: (libraryID: number | string) => {
        const {context, engine} = resources[libraryID];

        const statistics: Statistic[] = [];

        const draw = createDraw(libraryID, context);

        const setDraw = () => engine.setDraw(draw);
        const removeDraw = () => engine.removeDraw(draw.id);

        statisticsResource[libraryID] = {libraryID, statistics, setDraw, removeDraw, active: false};
    },
    set: (id: number | string, stat: Statistic) => statisticsResource[id].statistics.push(stat),
    setFn: (id: number | string, fn: () => string) => {
        const statID = uid();

        statisticsResource[id].statistics.push({
            id: statID,
            name: `${statID}-statistic-setFn`, // make order or something accounting for above method
            fn,
        });

        return statID;
    },
    remove: (id: string | number, statID: number | string) => {
        const index = statisticsResource[id].statistics.findIndex(stat => stat.id === statID);

        if (index === -1) throw Error(`statistic with id '${id}' not found, nothing to remove`);

        statisticsResource[id].statistics.splice(index, 1);
    },
    run: (id: number | string) => {
        statisticsResource[id].active = true;
        statisticsResource[id].setDraw();
    },
    halt: (id: string | number) => {
        // take screenshot and display as static image?
        statisticsResource[id].active = false;
        statisticsResource[id].removeDraw();
    },
    destroy: (id: string | number) => {
        statisticsResource[id].removeDraw();

        delete statisticsResource[id];
    },
    setToggleKey: (id: string | number, key: string) => {
        toggleKey[id] = key;
    },
};

const createDraw = (libraryID: string | number, ctx: CanvasRenderingContext2D) => {
    const txtPosDefault = vector(10, 10);
    let txtPos = vector(10, 10);
    const txtMargin = 5;

    return {
        id: `${libraryID}-statistic-draw`,
        name: `Statistic Show`,
        fn: () => {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px monospace';
            ctx.fillStyle = '#fff';

            for (let i = 0; i < statisticsResource[libraryID].statistics.length; i++) {
                const txt = statisticsResource[libraryID].statistics[i].fn();

                const metrics = ctx.measureText(txt);

                const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; // static
                // const actualHeight = metrics.actualBoundingBoxAscent +
                // metrics.actualBoundingBoxDescent; // depend on txt

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
};
