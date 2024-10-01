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

    // transforms empty callBacks to filled callBacks
    setCallBacks(entity, setEngine, callBacks);

    return callBacks;
};

// const handleDraw = {
//     set: (engine: Engine, update: Required<Draw>) => engine.setDraw(update),
//     remove: (engine: Engine, update: Required<Draw>) => engine.removeDraw(update.id),
// };

// const handleUpdate = {
//     set: (engine: Engine, update: Required<Update>) => engine.setUpdate(update),
//     remove: (engine: Engine, update: Required<Update>) => engine.removeUpdate(update.id),
// };

// Needs priority order
// export const createRender =
//     (engine: Engine, renders: EntityRenders): Render =>
//     (type, state) => {
//         if (type === 'draw') return handleDraw[state ? 'set' : 'remove'](engine, renders[type]);

//         handleUpdate[state ? 'set' : 'remove'](engine, renders[type]);
//     };

//
const createEngineRenders = (engine: Engine, renders: Partial<EntityRenders>) => ({
    animation: {
        on: () => {
            console.log('animation set in engineRender');

            if (renders.animation) engine.setUpdate(renders.animation);
        },
        off: () => {
            console.log('animation removed in engineRender');

            if (renders.animation) engine.removeUpdate(renders.animation.id);
        },
        set: false,
    },
    hover: {
        on: () => {
            console.log('hover set in engineRender');

            if (renders.hover) engine.setUpdate(renders.hover);
        },
        off: () => {
            console.log('hover removed in engineRender');

            if (renders.hover) engine.removeUpdate(renders.hover.id);
        },
        set: false,
    },
    start: {
        on: () => {
            console.log('startTransition set in engineRender');

            if (renders.start) engine.setUpdate(renders.start);
        },
        off: () => {
            console.log('startTransition removed in engineRender');

            if (renders.start) engine.removeUpdate(renders.start.id);
        },
        set: false,
    },
    end: {
        on: () => {
            console.log('endTransition set in engineRender');

            if (renders.end) engine.setUpdate(renders.end);
        },
        off: () => {
            console.log('endTransition removed in engineRender');

            if (renders.end) engine.removeUpdate(renders.end.id);
        },
        set: false,
    },
    draw: {
        on: () => {
            console.log('draw set in engineRender');

            if (renders.draw) engine.setDraw(renders.draw);
        },
        off: () => {
            console.log('draw removed in engineRender');

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
    {colors, animations, handlers}: InternalEntity,
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

        // Needs prepare function (usable for transitions that need preparations like this)
        if (animations.startType === 'fadein1') {
            colors.fill.a = 0;
            colors.stroke.a = 0;
            colors.textFill.a = 0;

            setEngine('start', 'on');
        }

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

        // Needs prepare function (usable for transitions that need preparations like this)
        if (animations.endType === 'fadeout1') {
            colors.fill.a = 1;
            colors.stroke.a = 1;
            colors.textFill.a = 1;

            setEngine('end', 'on');
        }

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
