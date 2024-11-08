import {vector} from '../vector';
import {initialize, resources} from '..';
import {StatisticOptions, StatisticResource, StatisticViewType} from 'library/types/statistics';
// import {createWindowOpener} from 'pages/window-open';
// import {createDualView} from '../dualview';

const statisticsResource: Record<string | number, StatisticResource> = {};
// const toggleKey: Record<string | number, string> = {};

// const popupSettings = {
//     width: 480,
//     height: 320,
//     backgroundColor: 'white',
//     clear: true,
//     containerID: 'stat-container',
// };

// const defaults: {type: StatisticViewType; ctrl: boolean} = {
//     type: 'overlay',
// internal properties:
// ctrl: false,
// };
// toggleKey: 'KeyF',
// button: true,

const properties = {
    // type: 'overlay',
    // button: false,
    // ctrl: false,
    // code: 'KeyJ',
};

// Make statistic properties / methods / activations etc. also part of statistics itself (to show)
export const setStatistics = (libraryID: number | string, options?: StatisticOptions) => {
    if (!options) return;

    // const properties = {...defaults, ...options};

    // const {input} = resources[libraryID];

    // if (!options.button && !options.code) {
    //     properties.toggleKey = 'KeyQ';
    //     properties.ctrl = true;

    //     // Make warning / error / throw module and also put this in statistics itself (with counter etc)
    //     console.log('setStatistics: no toggleKey and no button given: default toggle key set: ctrl-J');
    // }

    // if (properties.button) createButton(libraryID);

    const statisticType = createStatisticType(libraryID);

    const activate = statisticType[options.type];

    // const deactivate = () => {};

    const destroy = () => {
        // AddEvent to existing input from resources:
        // if (key) removeEventListener('keyup', toggleKeyListener);
        // remove eventlistener, remove updates/draw from engine, remove other types (popup window open methods?)
    };

    return {destroy, activate};
};

const createButton = (libraryID: string | number) => {
    const {
        canvas: {width, height},
        engine,
        context: ctx,
    } = resources[libraryID];

    const size = width / 40; // make this a non-arbitrary number based on size option for button
    const pos = {x: width - size * 2, y: size};

    const draw = {
        id: `stat-button-${libraryID}`,
        name: 'stat-activation-button',
        fn: () => {
            ctx.beginPath();

            ctx.strokeStyle = 'red';
            ctx.strokeRect(pos.x, pos.y, size, size);

            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.moveTo(pos.x + 0.1 * size, pos.y + size / 2);
            ctx.lineTo(pos.x + 0.9 * size, pos.y + size / 2);
            ctx.moveTo(pos.x + 0.2 * size, pos.y + size * 0.25);
            ctx.lineTo(pos.x + 0.8 * size, pos.y + size * 0.25);
            ctx.moveTo(pos.x + 0.2 * size, pos.y + size * 0.75);
            ctx.lineTo(pos.x + 0.8 * size, pos.y + size * 0.75);
            ctx.stroke();
        },
    };
    // console.log('button creation');
    engine.setDraw(draw);
};

// popup: create new resource and use vue template to load
// overlay: use existing resource, portrait or landscape according to aspect ratio existing canvas
// dual: almost entirely implemented, use existing code (reactivation)
// tab: almost same as popup, create new resource and use vue template to load
const createStatisticType = (libraryID: string | number) => ({
    overlay: () => {
        return () => {
            console.log('toggle call on overlay');

            const {canvas} = resources[libraryID];

            // const toggleKeyListener = (evt: KeyboardEvent) => {
            //     if (evt.code === key && evt.ctrlKey === ctrl) toggle();
            // };

            // // This depends on stat type (only overlay uses same canvas)
            // if (key) input.addListener('keyup', toggleKeyListener);
        };
    },
    popup: () => {
        const id = `statwindow-${libraryID}`;

        initialize(id);

        // const {openWindowCenter} = createWindowOpener('statistics', {width: 480, height: 320});

        return () => {
            console.log('toggle call on popup');
        };
    },
    tab: () => {
        return () => {
            console.log('toggle call on tab');
        };
    },
    dual: () => {
        return () => {
            console.log('toggle call on dual');
        };
    },
});

// create: (id: number | string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, engine: Engine) => {
//     const statistics: Statistic[] = [];

//     const draw = createDraw({id, context});

//     // These contain objects/modules from main resources, so they don't need to be set here aswell
//     statisticsResource[id] = {id, canvas, context, statistics, draw, engine, active: false};

//     toggleKey[id] = 'KeyT'; // default
//     addEventListener('keyup', ({code}) => {
//         if (code === toggleKey[id]) {
//             toggleView(id);
//         }
//     });
// },
// set: (id: number | string, stat: Statistic) => statisticsResource[id].statistics.push(stat),
// setFn: (id: number | string, fn: () => string) => {
//     const statID = uid();

//     statisticsResource[id].statistics.push({
//         id: statID,
//         name: `${statID}-statistic-setFn`, // make order or something accounting for above method
//         fn,
//     });

//     return statID;
// },
// remove: (id: string | number, statID: number | string) => {
//     const index = statisticsResource[id].statistics.findIndex(stat => stat.id === statID);

//     if (index === -1) throw Error(`statistic with id '${id}' not found, nothing to remove`);

//     statisticsResource[id].statistics.splice(index, 1);
// },
// run: (id: number | string) => {
//     statisticsResource[id].active = true;
//     statisticsResource[id].engine.setDraw(statisticsResource[id].draw);
// },
// halt: (id: string | number) => {
//     // take screenshot and display as static image?
// },
// destroy: (id: string | number) => {
//     statisticsResource[id].engine.removeDraw(`${id}-statistic-show`);

//     delete statisticsResource[id];
// },
// setToggleKey: (id: string | number, key: string) => {
//     toggleKey[id] = key;
// },

// const toggleView = (id: string | number) => {
//     const {engine, draw, active} = statisticsResource[id];

//     if (active) {
//         statisticsResource[id].active = false;

//         engine.removeDraw(`${id}-statistic-draw`);

//         return;
//     }

//     statisticsResource[id].active = true;

//     engine.setDraw(draw);
// };

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

// addEventListener('keyup', ({code}) => {
//     if (code === 'KeyZ') {
//         const source = '/statistics';
//         const source2 = '/';
//         const target = 'dsank';
//         // const options = 'popup, width=300, height=300';

//         const handler = window.open(source, target);

//         setTimeout(() => window.open(source2, target), 2000);

//         // setTimeout(() => handler?.close(), 2000);
//         // console.log('no error', handler);

//         // if (!handler) {
//         //     console.log('error', handler);
//         // }
//     }
// });
