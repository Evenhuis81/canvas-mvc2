// import {createDualView} from './dualview';

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

// TODO::Implement this into the input from library
// toggleKey[libraryID] = 'KeyT'; // default
// addEventListener('keyup', ({code}) => {
//     if (code === toggleKey[libraryID]) toggleView(libraryID);
// });

// Move this to statistics module
// const setStatistics = (options: Partial<StatisticOptions>) => {
// if (!options) return;
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
// };

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
