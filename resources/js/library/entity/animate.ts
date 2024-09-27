export const createRenders = (entity: InternalEntity) => {
    const {animationType, hoverType, startType, endType} = entity.animations;

    const animates = createAnimates(entity);

    return {
        animation: animationType ? animates.animationUpdates[animationType]() : emptyUpdate,
        hover: hoverType ? animates.hoverTransitions[hoverType]() : emptyUpdate,
        start: startType ? animates.entityTransitions[startType]() : emptyUpdate,
        end: endType ? animates.entityTransitions[endType]() : emptyUpdate,
        draw: createDraw(entity),
    };
};

const emptyUpdate = {
    id: 'emptyUpdate',
    name: 'Empty Update',
    fn: () => {},
};

const createAnimates = (entity: InternalEntity) => {
    // Make a create hover/start/endTransitions object from it, so entity doesn't need to get passed for every method?
    // Make multiple wrappers: (1. combine for entity global object, 2. create update/start/stop dynamically, 1liner?)
    const hoverTransitions = {
        bold: () => createBoldHoverTransitionUpdate(entity),
    };

    const entityTransitions = {
        fadein1: () => {
            console.log('fadeIn1 creation'); // Make this a statistic log
            // Handle differently
            // entity.colors.fill.a = 0;
            // entity.colors.stroke.a = 0;
            // entity.colors.textFill.a = 0;

            return createFadeIn1TransitionUpdate(entity, 0.005 * entity.animations.startSpeed);
        },
        fadeout1: () => {
            console.log('fadeOut1 creation'); // Make this a statistic log
            // Handle differently
            // entity.colors.fill.a = 1;
            // entity.colors.stroke.a = 1;
            // entity.colors.textFill.a = 1;

            return createFadeOut1TransitionUpdate(entity);
        },
    };

    const animationUpdates = {
        noise: () => {
            console.log('noise creation'); // Make this a statistic log

            return createNoiseUpdate(entity);
        },
    };

    return {
        hoverTransitions,
        entityTransitions,
        animationUpdates,
    };
};

const createFadeIn1TransitionUpdate = (
    {colors: {fill, stroke, textFill}, properties: {id, name}}: InternalEntity,
    alphaVelocity: number,
) => ({
    id,
    name: `entity-fadein1-update${name}`,
    fn: () => {
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) {
            fill.a = 1;
            stroke.a = 1;
            textFill.a = 1;

            // startEnd();
        }
    },
});

const createFadeOut1TransitionUpdate = ({
    properties: {id, name},
    // callBacks: {endEnd},
    colors: {fill, stroke, textFill},
}: InternalEntity) => ({
    id,
    name: `entity-fadeout1-update${name}`,
    fn: () => {
        fill.a -= 0.001;
        stroke.a -= 0.001;
        textFill.a -= 0.001;

        if (fill.a <= 0) {
            fill.a = 0;
            stroke.a = 0;
            textFill.a = 0;

            // endEnd();
        }
    },
});

const createBoldHoverTransitionUpdate = (entity: InternalEntity) => {
    const {sketch} = entity;

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

    return createTransitionUpdate(entity, {forward, reverse});
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

const createNoiseUpdate = ({properties: {id, name}, sketch}: InternalEntity) => ({
    id: id,
    name: `noise-animation-update-${name}`,
    fn: () => {
        sketch.x += upd.adj.x;
        sketch.y += upd.adj.y;

        upd.count++;

        if (upd.count > 60) {
            upd.adj.x *= -1;
            upd.adj.y *= -1;

            upd.count = 0;
        }
    },
});

const createDraw = ({
    properties: {id, name},
    sketch,
    context: ctx,
    colors: {fill, stroke, textFill},
}: InternalEntity) => {
    console.log('draw creation'); // Make this a statistic log

    return {
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
    };
};

const handleDraw = {
    set: (engine: Engine, update: Required<Draw>) => engine.setDraw(update),
    remove: (engine: Engine, update: Required<Draw>) => engine.removeDraw(update.id),
};

const handleUpdate = {
    set: (engine: Engine, update: Required<Update>) => engine.setUpdate(update),
    remove: (engine: Engine, update: Required<Update>) => engine.removeUpdate(update.id),
};

// const callBacks = getCallBacks(engine, renders, animations, handlers);

// Needs priority order
export const createRender =
    (engine: Engine, renders: EntityRenders): Render =>
    (type, state) => {
        if (type === 'draw') return handleDraw[state ? 'set' : 'remove'](engine, renders[type]);

        handleUpdate[state ? 'set' : 'remove'](engine, renders[type]);
    };

// max property is default 60, need for deltaTime, adj is change in property
// make this a createProperties that picks the needed properties for each update respectively
// This could also serve as an originalProperties object
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
