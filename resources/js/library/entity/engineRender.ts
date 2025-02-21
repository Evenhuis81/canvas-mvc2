import {Engine, EngineUpdate} from 'library/types/engine';
import {SetEngine, Visuals} from 'library/types/entity';

export const createEngineRenders = (engine: Engine, renders: Partial<Visuals>) => {
    const renderSet = {
        animation: false,
        hover: false,
        start: false,
        end: false,
        draw: false,
    };

    const rendders: {animation?: EngineUpdate & {id: string | number}; hover?: EngineUpdate & {id: string | number}} = {
        animation: undefined,
        hover: undefined,
    };

    const updateSwitch = (type: 'animation' | 'hover', state: 'on' | 'off') => {
        const rr = rendders[type];

        if (!rr) return console.log(`Render ${type} is not set`);
        // if (state === 'on') {
        //     return , can't set update in engine`);
        // }

        if (state === 'on') return engine.setUpdate(rr);

        engine.removeUpdate(rr.id);

        //     return;
        // }
        // if (state === 'on' && !rr) return console.log(`Render ${type} is not set, can't set update in engine`);

        rr;
        // if (state === 'on' && rendders[type]) return engine.setUpdate(rendders[type])
    };

    const setVisual = <K extends keyof typeof renderSet>(type: K, render: EngineUpdate) => {};

    const animation = {
        on: () => {
            if (renders.animation) engine.setUpdate(renders.animation.update);
        },
        off: () => {
            if (renders.animation) engine.removeUpdate(renders.animation.update.id);
        },
    };

    const hover = {
        on: () => {
            if (renders.hover) engine.setUpdate(renders.hover.update);
        },
        off: () => {
            if (renders.hover) engine.removeUpdate(renders.hover.update.id);
        },
    };

    const start = {
        on: () => {
            if (renders.start) {
                if (renders.start.prepare) renders.start.prepare();

                engine.setUpdate(renders.start.update);
            }
        },
        off: () => {
            if (renders.start) engine.removeUpdate(renders.start.update.id);
        },
    };

    const end = {
        on: () => {
            if (renders.end) {
                if (renders.end.prepare) renders.end.prepare();
                engine.setUpdate(renders.end.update);
            }
        },
        off: () => {
            if (renders.end) engine.removeUpdate(renders.end.update.id);
        },
    };

    const draw = {
        on: () => {
            if (renders.draw) engine.setDraw(renders.draw);
        },
        off: () => {
            if (renders.draw) engine.removeDraw(renders.draw.id);
        },
    };

    return {animation, hover, start, end};
};

// Possible returnvalue for setEngine: fail or succeed on setting update/draw
const createSetEngine = (engine: Engine, renders: Partial<Visuals>): SetEngine => {
    const engineRenders = createEngineRenders(engine, renders);

    return (type, state) => {
        if (state === 'on' && !engineRenders[type].set) {
            engineRenders[type][state]();

            engineRenders[type].set = true;
        } else if (state === 'off' && engineRenders[type].set) {
            engineRenders[type][state]();

            engineRenders[type].set = false;
        }
    };
};
