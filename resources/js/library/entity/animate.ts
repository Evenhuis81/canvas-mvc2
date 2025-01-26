/* eslint-disable max-lines-per-function */
import {Colors} from 'library/types/color';
import {Engine} from 'library/types/engine';
import {LibraryInput} from 'library/types/input';
import {createRenders} from './renders';
import type {
    Callbacks,
    EventHandler,
    GeneralProperties,
    SetEngine,
    SetVisual,
    VisualProperties,
    Visuals,
} from 'library/types/entity';
import type {Shape} from 'library/types/shapes';

export const createVisualsAndCallbacks = (
    gProps: GeneralProperties,
    vProps: VisualProperties,
    sketch: Shape,
    colors: Colors,
    input: LibraryInput,
    engine: Engine,
    context: CanvasRenderingContext2D,
    eventHandler: EventHandler,
) => {
    const {animationType, hoverType, startType, endType} = vProps;

    const callbacks = {...emptyCallbacks};

    // callbacks: Pick<Callbacks, 'startEnd' | 'endEnd'>,
    const renders = createRenders(gProps, sketch, colors, vProps, input, context, callbacks);

    const visuals = {
        entity: animationType ? renders.animations[animationType]() : undefined,
        hover: hoverType ? renders.hovers[hoverType]() : undefined,
        start: startType ? renders.transitions[startType]() : undefined,
        end: endType ? renders.transitions[endType]() : undefined,
        draw: renders.draw,
    };

    const mixedRenders = {...renders.animations, ...renders.hovers, ...renders.transitions};

    const setVisual: SetVisual = (kind, type) => (visuals[kind] = mixedRenders[type]());

    const setEngine = createSetEngine(engine, visuals);

    // transforms empty callbacks to functional callbacks
    setCallbacks(gProps, vProps, setEngine, callbacks, eventHandler);

    return {visuals, callbacks, setVisual};
};

// TODO::remove duplications and if statements, see comments in createCallbacks -> renders object
const createEngineRenders = (engine: Engine, renders: Partial<Visuals>) => ({
    entity: {
        on: () => {
            if (renders.entity) engine.setUpdate(renders.entity.update);
        },
        off: () => {
            if (renders.entity) engine.removeUpdate(renders.entity.update.id);
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

const setCallbacks = (
    gProps: GeneralProperties,
    vProps: VisualProperties,
    setEngine: SetEngine,
    callbacks: Callbacks,
    {startTransition, finishTransition, entityListenerEvents}: EventHandler,
) => {
    callbacks.start = quickShow => {
        if (quickShow) {
            setEngine('draw', 'on');
            setEngine('entity', 'on');
            setEngine('hover', 'on');

            return;
        }

        setEngine('start', 'on');

        if (vProps.animateAtStart && vProps.startType) setEngine('entity', 'on');

        // set hover on startTransition? This requires proper checking on sketch properties change

        setEngine('draw', 'on');
    };

    callbacks.startEnd = () => {
        setEngine('start', 'off');
        setEngine('entity', 'on'); // This could have a (double) check
        setEngine('hover', 'on');

        if (startTransition) startTransition(entityListenerEvents.startTransition);
    };

    callbacks.end = quickHide => {
        if (quickHide) {
            setEngine('draw', 'off');
            setEngine('entity', 'off');
            setEngine('hover', 'off');

            return;
        }

        setEngine('end', 'on');

        // Useless check? if entity is !'none', entity is already running
        if (vProps.animateAtEnd && vProps.endType) setEngine('entity', 'on');

        // See comments on this in callback.start()
        setEngine('hover', 'off');
    };

    callbacks.endEnd = () => {
        setEngine('end', 'off');
        setEngine('entity', 'off'); // This could have a (double) check
        setEngine('hover', 'off');

        if (finishTransition) finishTransition(entityListenerEvents.finishTransition);
    };
};

const emptyCallbacks = {
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
};
