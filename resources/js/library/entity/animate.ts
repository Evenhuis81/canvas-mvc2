export const createCallBacks = (entity: InternalEntity) => {
    const {animationType, hoverType, startType, endType} = entity.animations;

    const callBacks = createEmptyCallBacks();

    const renders = createRenderUpdates(entity, callBacks);

    const draw = createDraw(entity);

    const updates = {
        animation:
            animationType === 'none'
                ? undefined
                : {
                      set: false,
                      update: renders.animationUpdates[animationType](),
                  },
        hover:
            hoverType === 'none'
                ? undefined
                : {
                      set: false,
                      update: renders.hoverTransitions[hoverType](),
                  },
        start:
            startType === 'none'
                ? undefined
                : {
                      set: false,
                      update: renders.entityTransitions[startType](),
                  },
        end:
            endType === 'none'
                ? undefined
                : {
                      set: false,
                      update: renders.entityTransitions[endType](),
                  },
    };

    // transforms empty callBacks to filled callBacks
    setCallBacks(entity, updates, draw, callBacks);

    return callBacks;
};

const setCallBacks = (
    {colors, animations, handlers, engine}: InternalEntity,
    updates: Partial<EntityUpdates>,
    draw: EntityDraw,
    callBacks: EntityCallBacks,
) => {
    // This could be mandatory parameter
    callBacks.start = quickShow => {
        console.log('callBack start');

        // Make dynamic and create statistic view for engine (amount of updates/draws and properties)
        if (!quickShow) {
            console.log('callBack start: FadeIn1');
            if (updates.start) {
                // Needs prepare function (usable for transitions that need preparations like this)
                if (animations.startType === 'fadein1') {
                    colors.fill.a = 0;
                    colors.stroke.a = 0;
                    colors.textFill.a = 0;
                }

                engine.setUpdate(updates.start.update);
            }

            // Could do with a propertyCheck -> !animateAtStart = !animations.animationType === 'none'
            // Another option is to just overwrite the updates and ignore updates that are already set
            if (animations.animateAtStart && updates.animation) {
                console.log('callBack start: animateAtStart set');

                engine.setUpdate(updates.animation.update);
                updates.animation.set = true;
            }
        }

        // set hover on startTransition?
        if (updates.hover && quickShow) {
            console.log('callBack start: hover set');

            engine.setUpdate(updates.hover.update);
            updates.hover.set = true;
        }

        draw.set = true;
        engine.setDraw(draw.draw);
    };

    callBacks.startEnd = () => {
        console.log('callBack startEnd');

        // TODO::Make this more efficient
        if (updates.start) engine.removeUpdate(updates.start.update.id);

        // To properly test and check, this needs an overview on running updates
        if (updates.animation && !updates.animation.set) engine.setUpdate(updates.animation.update);

        if (updates.hover && !updates.hover.set) {
            console.log('callBack startEnd: hover set');

            engine.setUpdate(updates.hover.update);
            updates.hover.set = true;
        }

        handlers.onStartEnd();
    };

    callBacks.end = quickHide => {
        console.log('callBack end');

        if (!quickHide) {
            // TODO::Make this more efficient
            if (!animations.animateAtEnd && updates.animation && updates.animation.set) {
                console.log('callBack end: animateAtEnd removed');

                updates.animation.set = false;
                engine.removeUpdate(updates.animation.update.id);
            }

            if (updates.end) {
                // Needs prepare function (usable for transitions that need preparations like this)
                if (animations.endType === 'fadeout1') {
                    console.log('callBack end: FadeOut1');
                    colors.fill.a = 1;
                    colors.stroke.a = 1;
                    colors.textFill.a = 1;
                }

                engine.setUpdate(updates.end.update);
            }
        }

        // This oculd be optional
        if (updates.hover && updates.hover.set) {
            console.log('callBack end: hover removed');

            updates.hover.set = false;
            engine.removeUpdate(updates.hover.update.id);
        }

        // if (!updates.end && quickHide)
    };

    callBacks.endEnd = () => {
        console.log('callBack endEnd');

        // TODO::Make this more efficient
        if (updates.end) engine.removeUpdate(updates.end.update.id);

        if (updates.animation && updates.animation.set) {
            console.log('callBack endEnd: animation removed');

            updates.animation.set = false;
            engine.removeUpdate(updates.animation.update.id);
        }

        // See callBacks.end, this could be optiional
        if (updates.hover && updates.hover.set) {
            console.log('callBack endEnd: hover removed');

            engine.removeUpdate(updates.hover.update.id);

            updates.hover.set = false;
        }

        handlers.onEndEnd();
    };
};

const createRenderUpdates = (entity: InternalEntity, emptyCallBacks: Pick<EntityCallBacks, 'startEnd' | 'endEnd'>) => {
    const {id, name} = entity.properties;

    const hoverTransitions = {
        // Add statistics hoverTransitions view
        bold: () => {
            const transition = createBoldHoverTransition(entity.sketch);

            return createTransitionUpdate(entity, transition);
        },
    };

    const entityTransitions = {
        fadein1: () => {
            // Add statistics entityTransitions view, remove arbitrary speed
            return {
                id,
                name: `entity-fadein1-update${name}`,
                fn: createFadeIn1TransitionUpdateFn(
                    entity.colors,
                    0.005 * entity.animations.startSpeed,
                    emptyCallBacks,
                ),
            };
        },
        fadeout1: () => {
            // Add statistics entityTransitions view
            return {
                id,
                name: `entity-fadeout1-update${name}`,
                fn: createFadeOut1TransitionUpdateFn(entity.colors, 0.005 * entity.animations.endSpeed, emptyCallBacks),
            };
        },
    };

    const animationUpdates = {
        noise: () => {
            // Add statistics animationUpdates view
            return {
                id,
                name: `noise-animation-update-${name}`,
                fn: createNoiseUpdate(entity.sketch),
            };
        },
    };

    return {
        hoverTransitions,
        entityTransitions,
        animationUpdates,
    };
};

const createBoldHoverTransition = (sketch: EntitySketch) => {
    const origin = {
        lw: sketch.lw,
        f: sketch.fontSize,
    };

    const steps = 30;
    const lwAdj = 0.1;
    const fAdj = lwAdj / 2;
    const lwRange = lwAdj * steps;
    const fRange = lwRange / 2;

    const forward = () => {
        sketch.lw += lwAdj;
        sketch.fontSize += fAdj;

        if (sketch.lw > origin.lw + lwRange) {
            sketch.lw = origin.lw + lwRange;
            sketch.fontSize = origin.f + fRange;
        }
    };

    const reverse = () => {
        sketch.lw -= lwAdj;
        sketch.fontSize -= fAdj;

        if (sketch.lw < origin.lw) {
            sketch.lw = origin.lw;
            sketch.fontSize = origin.f;
        }
    };

    return {forward, reverse};
};

const createFadeIn1TransitionUpdateFn =
    ({fill, stroke, textFill}: EntityColors, alphaVelocity: number, callBacks: Pick<EntityCallBacks, 'startEnd'>) =>
    () => {
        console.log('fadein1 update running');
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) {
            fill.a = 1;
            stroke.a = 1;
            textFill.a = 1;

            callBacks.startEnd();
        }
    };

const createFadeOut1TransitionUpdateFn =
    ({fill, stroke, textFill}: EntityColors, alphaVelocity: number, callBacks: Pick<EntityCallBacks, 'endEnd'>) =>
    () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) {
            fill.a = 0;
            stroke.a = 0;
            textFill.a = 0;

            callBacks.endEnd();
        }
    };

const createTransitionUpdate = (
    {properties: {id, name}, input: {mouse}, sketch}: InternalEntity,
    transition: TransitionBase,
) => ({
    id,
    name: `entity-hover-update${name}`,
    fn: () => {
        if (mouse.insideRect(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    },
});

const createNoiseUpdate = (sketch: EntitySketch) => () => {
    sketch.x += upd.adj.x;
    sketch.y += upd.adj.y;

    upd.count++;

    if (upd.count > 60) {
        upd.adj.x *= -1;
        upd.adj.y *= -1;

        upd.count = 0;
    }
};

const createDraw = ({
    properties: {id, name},
    sketch,
    context: ctx,
    colors: {fill, stroke, textFill},
}: InternalEntity) => ({
    set: false,
    draw: {
        id,
        name: `draw-${name}`,
        fn: () => {
            ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
            ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
            ctx.lineWidth = sketch.lw;

            ctx.beginPath();
            ctx.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.r);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
            ctx.font = `${sketch.fontSize}px ${sketch.font}`;

            ctx.textAlign = sketch.textAlign;
            ctx.textBaseline = sketch.textBaseLine;

            ctx.beginPath();
            ctx.fillText(sketch.text, sketch.x, sketch.y + 1.5);
        },
    },
});

const createEmptyCallBacks = () => ({
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
});

const emptyUpdate = {
    id: 'emptyUpdate',
    name: 'Empty Update',
    fn: () => {},
};

// max property is default 60, need for deltaTime, adj is change in property
// make this a createProperties that picks the needed properties for each update respectively
const upd = {
    origin: {
        lw: 0,
    },
    range: {
        lw: 1,
    },
    vel: {
        x: 0,
        y: 0,
    },
    adj: {
        x: 0.5,
        y: 0.5,
    },
    lw: 0,
    count: 0,
    max: 60,
    angle: 0,
};
