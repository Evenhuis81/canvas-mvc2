export const createCreateRenders = (
    entity: InternalEntity,
    emptyCallBacks: Pick<EntityCallBacks, 'startEnd' | 'endEnd'>,
) => {
    const {id, name} = entity.properties;

    const hoverTransitions = {
        bold: () => {
            const transition = createBoldHoverTransition(entity.sketch);

            return {
                id: id + '-hover',
                name: `entity-hover-update${name}`,
                fn: createTransitionUpdate(entity, transition),
            };
        },
    };

    // See animate, callBacks start/end comment (prepare function)
    const entityTransitions = {
        fadein1: () => ({
            id: id + '-fadein1',
            name: `entity-fadein1-update${name}`,
            fn: createFadeIn1TransitionUpdate(entity.colors, 0.005 * entity.animations.startSpeed, emptyCallBacks),
        }),
        fadeout1: () => ({
            id: id + '-fadeout1',
            name: `entity-fadeout1-update${name}`,
            fn: createFadeOut1TransitionUpdate(entity.colors, 0.005 * entity.animations.endSpeed, emptyCallBacks),
        }),
    };

    const animationUpdates = {
        noise: () => ({
            id: id + '-animation',
            name: `noise-animation-update-${name}`,
            fn: createNoiseUpdate(entity.sketch),
        }),
    };

    const draw = {
        id: id + '-draw',
        name: `draw-${name}`,
        fn: createDraw(entity),
    };

    return {
        hoverTransitions,
        entityTransitions,
        animationUpdates,
        draw,
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

const createFadeIn1TransitionUpdate =
    ({fill, stroke, textFill}: EntityColors, alphaVelocity: number, callBacks: Pick<EntityCallBacks, 'startEnd'>) =>
    () => {
        console.log('fadein1 update running');
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) {
            // create endPrepare method for this and put in animate.ts
            fill.a = 1;
            stroke.a = 1;
            textFill.a = 1;

            callBacks.startEnd();
        }
    };

const createFadeOut1TransitionUpdate =
    ({fill, stroke, textFill}: EntityColors, alphaVelocity: number, callBacks: Pick<EntityCallBacks, 'endEnd'>) =>
    () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) {
            // create endPrepare method for this and put in animate.ts
            fill.a = 0;
            stroke.a = 0;
            textFill.a = 0;

            callBacks.endEnd();
        }
    };

const createTransitionUpdate =
    ({input: {mouse}, sketch}: InternalEntity, transition: TransitionBase) =>
    () => {
        if (mouse.insideRect(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    };

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

const createDraw =
    ({sketch, context: ctx, colors: {fill, stroke, textFill}}: InternalEntity) =>
    () => {
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
