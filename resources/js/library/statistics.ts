import {uid} from './helpers';
import {vector} from './vector';
import type {Statistic, StatisticResource} from './types/statistics';

const statisticsResource: Record<string | number, StatisticResource> = {};
const toggleKey: Record<string | number, string> = {};

const toggleView = (id: string | number) => {
    const {engine, show, active} = statisticsResource[id];

    if (active) {
        statisticsResource[id].active = false;

        engine.removeShow(`${id}-statistic-show`);

        return;
    }

    statisticsResource[id].active = true;

    engine.setShow(show);
};

export default {
    create: (id: number | string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, engine: Engine) => {
        const statistics: Statistic[] = [];

        const show = createShow({id, context});

        // These contain objects/modules from main resources, so they don't need to be set here aswell
        statisticsResource[id] = {id, canvas, context, statistics, show, engine, active: false};

        toggleKey[id] = 'KeyT'; // default
        addEventListener('keyup', ({code}) => {
            if (code === toggleKey[id]) toggleView(id);
        });
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
        statisticsResource[id].engine.setShow(statisticsResource[id].show);
    },
    halt: (id: string | number) => {
        // take screenshot and display as static image?
    },
    destroy: (id: string | number) => {
        statisticsResource[id].engine.removeShow(`${id}-statistic-show`);

        delete statisticsResource[id];
    },
    setToggleKey: (id: string | number, key: string) => {
        toggleKey[id] = key;
    },
};

const createShow = (props: Omit<StatisticResource, 'show' | 'canvas' | 'engine' | 'statistics' | 'active'>) => {
    const {id, context: ctx} = props;

    const txtPosDefault = vector(10, 10);
    let txtPos = vector(10, 10);
    const txtMargin = 5;

    return {
        id: `${id}-statistic-show`,
        name: `Statistic Show`,
        fn: () => {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px monospace';
            ctx.fillStyle = '#fff';

            for (let i = 0; i < statisticsResource[id].statistics.length; i++) {
                const txt = statisticsResource[id].statistics[i].fn();

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
