import {createCreateRenders} from './renders';

export const createCallBacks = (entity: InternalEntity) => {
    const {animationType, hoverType, startType, endType} = entity.animations;

    const callBacks = createEmptyCallBacks();

    const createRenders = createCreateRenders(entity, callBacks);

    // convert undefined to empty update/draw? (for engineRenders)
    const renders = {
        animation: animationType === 'none' ? undefined : createRenders.animationUpdates[animationType](),
        hover: hoverType === 'none' ? undefined : createRenders.hoverTransitions[hoverType](),
        start: startType === 'none' ? undefined : createRenders.entityTransitions[startType](),
        end: endType === 'none' ? undefined : createRenders.entityTransitions[endType](),
        draw: createRenders.draw,
    };

    const setEngine = createSetEngine(entity.engine, renders);

    // transforms empty callBacks to usable callBacks
    setCallBacks(entity, setEngine, callBacks);

    return callBacks;
};

// TODO::remove duplications and if statements, see comments in createCallBacks -> renders object
const createEngineRenders = (engine: Engine, renders: Partial<EntityRenders>) => ({
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
const createSetEngine = (engine: Engine, renders: Partial<EntityRenders>): EntitySetEngine => {
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
    {animations, handlers}: InternalEntity,
    setEngine: EntitySetEngine,
    callBacks: EntityCallBacks,
) => {
    callBacks.start = quickShow => {
        console.log('callBack start', `quickShow: ${quickShow}`);

        if (quickShow) {
            setEngine('draw', 'on');
            setEngine('animation', 'on');
            setEngine('hover', 'on');

            return;
        }

        setEngine('start', 'on');

        if (animations.animateAtStart && animations.startType !== 'none') setEngine('animation', 'on');

        // set hover on startTransition? This requires proper checking on sketch properties change

        setEngine('draw', 'on');
    };

    callBacks.startEnd = () => {
        console.log('callBack startEnd');

        setEngine('start', 'off');
        setEngine('animation', 'on'); // This could have a (double) check
        setEngine('hover', 'on');

        handlers.onStartEnd();
    };

    callBacks.end = quickHide => {
        console.log('callBack end', `quickHide: ${quickHide}`);

        if (quickHide) {
            setEngine('draw', 'off');
            setEngine('animation', 'off');
            setEngine('hover', 'off');

            return;
        }

        setEngine('end', 'on');

        // Useless check? if animation is !'none', animation is already running
        if (animations.animateAtEnd && animations.endType !== 'none') setEngine('animation', 'on');

        // See comments on this in callBack.start()
        setEngine('hover', 'off');
    };

    callBacks.endEnd = () => {
        console.log('callBack endEnd');

        setEngine('end', 'off');
        setEngine('animation', 'off'); // This could have a (double) check
        setEngine('hover', 'off');

        handlers.onEndEnd();
    };
};

const createEmptyCallBacks = () => ({
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
});
