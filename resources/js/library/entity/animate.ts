import {createRenders} from './renders';
import type {Colors} from 'library/types/color';
import type {Engine} from 'library/types/engine';
import type {LibraryInput} from 'library/types/input';
import type {
    EventHandler,
    GeneralProperties,
    SetEngine,
    SetVisual,
    VisualProperties,
    Visuals,
} from 'library/types/entity';

export const createVisualsAndCallbacks = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: any, // make generic sketch from input (to cretae draw method)
    colors: Colors,
    input: LibraryInput,
    engine: Engine,
    context: CanvasRenderingContext2D,
    eventHandler: EventHandler,
) => {
    const {animation, hover, start, end} = vProps;

    // const callbacks = {...emptyCallbacks};

    const renders = createRenders(gProps, sketch, colors, vProps, input, context);

    const visuals = {
        animation: animation ? renders.animations[animation]() : undefined,
        hover: hover ? renders.hovers[hover]() : undefined,
        start: start ? renders.transitions[start]() : undefined,
        end: end ? renders.transitions[end]() : undefined,
        draw: renders.draw,
    };

    const mixedRenders = {...renders.animations, ...renders.hovers, ...renders.transitions};

    const setVisual: SetVisual = (kind, type) => (visuals[kind] = mixedRenders[type]());

    const setEngine = createSetEngine(engine, visuals);

    // transforms empty callbacks to functional callbacks
    set(vProps, setEngine, eventHandler);

    return {callbacks, setVisual};
};

// TODO::remove duplications and if statements, see comments in createCallbacks -> renders object
const createEngineRenders = (engine: Engine, renders: Partial<Visuals>) => ({
    animation: {
        on: () => {
            if (renders.animation) engine.setUpdate(renders.animation.update);
        },
        off: () => {
            if (renders.animation) engine.removeUpdate(renders.animation.update.id);
        },
        set: false,
    },
    hover: {
        on: () => {
            if (renders.hover) engine.setUpdate(renders.hover.update);
        },
        off: () => {
            if (renders.hover) engine.removeUpdate(renders.hover.update.id);
        },
        set: false,
    },
    start: {
        on: () => {
            if (renders.start) {
                if (renders.start.prepare) renders.start.prepare();

                engine.setUpdate(renders.start.update);
            }
        },
        off: () => {
            if (renders.start) engine.removeUpdate(renders.start.update.id);
        },
        set: false,
    },
    end: {
        on: () => {
            if (renders.end) {
                if (renders.end.prepare) renders.end.prepare();
                engine.setUpdate(renders.end.update);
            }
        },
        off: () => {
            if (renders.end) engine.removeUpdate(renders.end.update.id);
        },
        set: false,
    },
    draw: {
        on: () => {
            if (renders.draw) engine.setDraw(renders.draw);
        },
        off: () => {
            if (renders.draw) engine.removeDraw(renders.draw.id);
        },
        set: false,
    },
});

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

const createSetCallback = (
    vProps: Partial<VisualProperties>,
    setEngine: SetEngine,
    {
        entityListenerEvents: {startTransition: startEvent, endTransition: endEvent},
        entityListeners: {startTransition, endOfStartTransition, endTransition, endOfEndTransition},
    }: EventHandler,
) => ({
    start: () => {
        setEngine('draw', 'on');
        setEngine('start', 'on');

        if (startTransition) startTransition(startEvent);
    },
    endOfStart: () => {
        setEngine('start', 'off');
        setEngine('animation', 'on');
        setEngine('hover', 'on');

        if (endOfStartTransition) endOfStartTransition(startEvent);
    },
    end: () => {
        setEngine('end', 'on');
        setEngine('hover', 'off');
        setEngine('animation', 'off');

        if (endTransition) endTransition(endEvent);
    },
    endOfEnd: () => {
        setEngine('end', 'off');
        setEngine('animation', 'off');
        setEngine('hover', 'off');

        if (endOfEndTransition) endOfEndTransition(endEvent);
    },
});
