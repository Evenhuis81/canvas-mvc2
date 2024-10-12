/* eslint-disable max-lines-per-function */
import {createRenders} from './renders';

export const createVisualsAndCallBacks = (entity: EntityTemp) => {
    const {animationType, hoverType, startType, endType} = entity.visualProperties;

    const callBacks = createEmptyCallBacks();

    const renders = createRenders(entity, callBacks);

    // convert undefined to empty update/draw? (for engineRenders)
    // Make completely optional (see notes in notebook)
    const visuals = {
        entity: animationType ? renders.animations[animationType]() : undefined,
        hover: hoverType ? renders.hovers[hoverType]() : undefined,
        start: startType ? renders.transitions[startType]() : undefined,
        end: endType ? renders.transitions[endType]() : undefined,
        draw: renders.draw,
    };

    // const setVisual = (type: EntityVisualTypes) => {
    //     visuals[type] = createRenders.animationUpdates[renderType];
    // };

    // const removeVisual = () => {};

    const setEngine = createSetEngine(entity.engine, visuals);

    // transforms empty callBacks to functional callBacks
    setCallBacks(entity, setEngine, callBacks);

    return {visuals, callBacks};
};

// TODO::remove duplications and if statements, see comments in createCallBacks -> renders object
const createEngineRenders = (engine: Engine, renders: Partial<EntityVisuals>) => ({
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
const createSetEngine = (engine: Engine, renders: Partial<EntityVisuals>): EntitySetEngine => {
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

const setCallBacks = (
    {visualProperties, userListeners, properties}: EntityTemp,
    setEngine: EntitySetEngine,
    callBacks: EntityCallBacks,
) => {
    callBacks.start = quickShow => {
        if (quickShow) {
            setEngine('draw', 'on');
            setEngine('entity', 'on');
            setEngine('hover', 'on');

            return;
        }

        setEngine('start', 'on');

        if (visualProperties.animateAtStart && visualProperties.startType) setEngine('entity', 'on');

        // set hover on startTransition? This requires proper checking on sketch properties change

        setEngine('draw', 'on');
    };

    callBacks.startEnd = () => {
        setEngine('start', 'off');
        setEngine('entity', 'on'); // This could have a (double) check
        setEngine('hover', 'on');

        userListeners.startTransitionEnd(properties.clicked);
    };

    callBacks.end = quickHide => {
        if (quickHide) {
            setEngine('draw', 'off');
            setEngine('entity', 'off');
            setEngine('hover', 'off');

            return;
        }

        setEngine('end', 'on');

        // Useless check? if entity is !'none', entity is already running
        if (visualProperties.animateAtEnd && visualProperties.endType) setEngine('entity', 'on');

        // See comments on this in callBack.start()
        setEngine('hover', 'off');
    };

    callBacks.endEnd = () => {
        setEngine('end', 'off');
        setEngine('entity', 'off'); // This could have a (double) check
        setEngine('hover', 'off');

        userListeners.endTransitionEnd(properties.clicked);
    };
};

const createEmptyCallBacks = () => ({
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
});
