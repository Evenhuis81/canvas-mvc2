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
            //
        },
        off: () => {
            //
        },
        set: false,
    },
    hover: {
        on: () => {
            //
        },
        off: () => {
            //
        },
        set: false,
    },
    start: {
        on: () => {
            //
        },
        off: () => {
            //
        },
        set: false,
    },
    end: {
        on: () => {
            //
        },
        off: () => {
            //
        },
        set: false,
    },
    draw: {
        on: () => {
            console.log('draw set in engineRender');

            if (renders.draw) engine.setDraw(renders.draw);
        },
        off: () => {
            //
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
        if (quickShow) return setEngine('draw', 'on');

        // Needs prepare function (usable for transitions that need preparations like this)
        if (animations.startType === 'fadein1') {
            colors.fill.a = 0;
            colors.stroke.a = 0;
            colors.textFill.a = 0;

            setEngine('start', 'on');
        }

        if (animations.animateAtStart && animations.startType !== 'none') {
            console.log('callBack start: animateAtStart set');

            setEngine('animation', 'on');
        }

        // set hover on startTransition?
        if (animations.hoverType !== 'none') {
            console.log('callBack start: hover set');

            setEngine('hover', 'on');
        }

        setEngine('draw', 'on');
    };

    callBacks.startEnd = () => {
        console.log('callBack startEnd');

        // just remove all from setEngine (even if not set)
        // if (updates.start) engine.removeUpdate(updates.start.update.id);

        // To properly test and check, this needs an overview on running updates
        // if (updates.animation && !updates.animation.set) engine.setUpdate(updates.animation.update);

        // if (updates.hover && !updates.hover.set) {
        //     console.log('callBack startEnd: hover set');

        //     engine.setUpdate(updates.hover.update);
        //     updates.hover.set = true;
        // }

        handlers.onStartEnd();
    };

    callBacks.end = quickHide => {
        console.log('callBack end');

        if (quickHide) return setEngine('draw', 'off');

        // if (!quickHide) {
        //     if (!animations.animateAtEnd && updates.animation && updates.animation.set) {
        //         console.log('callBack end: animateAtEnd removed');

        //         updates.animation.set = false;
        //         engine.removeUpdate(updates.animation.update.id);
        //     }

        //     if (updates.end) {
        //         // Needs prepare function (usable for transitions that need preparations like this)
        //         if (animations.endType === 'fadeout1') {
        //             console.log('callBack end: FadeOut1');
        //             colors.fill.a = 1;
        //             colors.stroke.a = 1;
        //             colors.textFill.a = 1;
        //         }

        //         engine.setUpdate(updates.end.update);
        //     }
        // }

        // This oculd be optional
        // if (updates.hover && updates.hover.set) {
        //     console.log('callBack end: hover removed');

        //     updates.hover.set = false;
        //     engine.removeUpdate(updates.hover.update.id);
        // }

        // if (!updates.end && quickHide)
    };

    callBacks.endEnd = () => {
        console.log('callBack endEnd');

        // if (updates.end) engine.removeUpdate(updates.end.update.id);

        // if (updates.animation && updates.animation.set) {
        //     console.log('callBack endEnd: animation removed');

        //     updates.animation.set = false;
        //     engine.removeUpdate(updates.animation.update.id);
        // }

        // // See callBacks.end, this could be optional
        // if (updates.hover && updates.hover.set) {
        //     console.log('callBack endEnd: hover removed');

        //     engine.removeUpdate(updates.hover.update.id);

        //     updates.hover.set = false;
        // }

        handlers.onEndEnd();
    };
};

const createEmptyCallBacks = () => ({
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
});
