import type {Engine} from 'library/types/engine';
import type {EngineState, SetEngine, VisualType, Visuals} from 'library/types/entity';

export const createSetEngine = (engine: Engine, visuals: Partial<Visuals>): SetEngine => {
    // Possibly handle pre, post and callback here
    const setEngine = (type: VisualType, state: EngineState) => {
        const visual = visuals[type];

        if (!visual) return setEngineLog(type, state);

        return engine.handle(visual.render, state === 'on');
    };

    return setEngine;
};

const setEngineLog = (type: string, state: string) => console.log(`setEngine: ${type} is not set, state: ${state}`);

// export const createEngineRenders = (engine: Engine, renders: Partial<Visuals>) => {
//     const renderSet = {
//         animation: false,
//         hover: false,
//         start: false,
//         end: false,
//         draw: false,
//     };

//     const rendders: {animation?: EngineUpdate & {id: string | number}; hover?: EngineUpdate & {id: string | number}} = {
//         animation: undefined,
//         hover: undefined,
//     };
// }

// const updateSwitch = (type: 'animation' | 'hover', state: 'on' | 'off') => {
//     const rr = rendders[type];

//     if (!rr) return console.log(`Render ${type} is not set`);

//     if (state === 'on') {
//         return , can't set update in engine`);
//     }

//     if (state === 'on') return engine.setUpdate(rr);

//     engine.removeUpdate(rr.id);

//     if (state === 'on' && !rr) return console.log(`Render ${type} is not set, can't set update in engine`);

//     rr;
//     if (state === 'on' && rendders[type]) return engine.setUpdate(rendders[type])
// };
