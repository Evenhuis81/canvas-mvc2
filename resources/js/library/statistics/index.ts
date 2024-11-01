import {uid} from '../helpers';
import {vector} from '../vector';
// import {createDualView} from '../dualview';
import {initialize, resources} from '..';
import {Statistic, StatisticResource} from 'library/types/statistics';

export const statisticMenu = {
    setup: async () => {
        initialize('stats', {
            containerID: 'container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        // mainMenu();
    },
    run: () => resources.stats.engine.run(),
    runOnce: () => resources.stats.engine.runOnce(),
};

const statisticsResource: Record<string | number, StatisticResource> = {};
const toggleKey: Record<string | number, string> = {};

const toggleView = (id: string | number) => {
    const {engine, draw, active} = statisticsResource[id];

    if (active) {
        statisticsResource[id].active = false;

        engine.removeDraw(`${id}-statistic-draw`);

        return;
    }

    statisticsResource[id].active = true;

    engine.setDraw(draw);
};

export default {
    create: (id: number | string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, engine: Engine) => {
        const statistics: Statistic[] = [];

        const draw = createDraw({id, context});

        // These contain objects/modules from main resources, so they don't need to be set here aswell
        statisticsResource[id] = {id, canvas, context, statistics, draw, engine, active: false};

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
        statisticsResource[id].engine.setDraw(statisticsResource[id].draw);
    },
    halt: (id: string | number) => {
        // take screenshot and display as static image?
    },
    destroy: (id: string | number) => {
        statisticsResource[id].engine.removeDraw(`${id}-statistic-show`);

        delete statisticsResource[id];
    },
    setToggleKey: (id: string | number, key: string) => {
        toggleKey[id] = key;
    },
};

const createDraw = (props: Omit<StatisticResource, 'draw' | 'canvas' | 'engine' | 'statistics' | 'active'>) => {
    const {id, context: ctx} = props;

    const txtPosDefault = vector(10, 10);
    let txtPos = vector(10, 10);
    const txtMargin = 5;

    return {
        id: `${id}-statistic-draw`,
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

// Move this to statistics module
const setStatistics = (options: Partial<StatisticOptions>) => {
    if (!options) return;
    // ToggleKey default set to KeyT here, but ideally this should be optional. (this is outside the statistics module and default
    // should be set inside the module.)
    // const statResources = {
    //     id,
    //     engine,
    //     context,
    //     canvas,
    //     container,
    //     toggleKey: options.statistics.toggleKey ?? 'KeyT',
    // };
    // let key: keyof StatisticOptions;

    // for (key in options.statistics) {
    //     statSwitch[key](statResources);
    // }
};

// StatisticOptions (create interface)
// popup: boolean;
// overlay: boolean;
// tab: boolean;
// dualView: boolean;
// toggleKey: string;

// const statSwitch: Record<keyof StatisticOptions, (resource: Resources) => void> = {
// DualView and Statistics are together untill DualView gets multi purpose
// Beware deactivated firing even when it has not yet become activated
// const createStatSwitch = () => ({
//     dualView: () => {
//         // const {setListeners} = createDualView({statResource});

//         const onActivation = () => {
//             console.log('activated');
//         };

//         const onDeactivation = () => {
//             console.log('de-activated');
//         };

//         setListeners(onActivation, onDeactivation);
//     },
//     // When dualView is true, this should not be true
//     overlay: ({id, canvas, context, engine}) => {
//         statistics.create(id, canvas, context, engine);

//         statistics.setFn(id, () => 'test stat');

//         // statistics.run(id);
//     },
//     toggleKey: ({id, toggleKey}) => statistics.setToggleKey(id, toggleKey),
// });

addEventListener('keyup', ({code}) => {
    if (code === 'KeyZ') {
        const source = '/statistics';
        const source2 = '/';
        const target = 'dsank';
        // const options = 'popup, width=300, height=300';

        const handler = window.open(source, target);

        setTimeout(() => window.open(source2, target), 2000);

        // setTimeout(() => handler?.close(), 2000);
        // console.log('no error', handler);

        // if (!handler) {
        //     console.log('error', handler);
        // }
    }
});
