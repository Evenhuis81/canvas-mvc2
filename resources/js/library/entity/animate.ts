export const createRenders = (entity: InternalEntity) => {
    const {animationType} = entity.properties;
    const {hoverType, startType, endType} = entity.transitions;

    return {
        animation: animationType ? animationUpdates[animationType](entity) : undefined,
        hover: hoverType ? hoverTransitions[hoverType](entity) : undefined,
        start: startType ? startEndTransitions[startType](entity) : undefined,
        end: endType ? startEndTransitions[endType](entity) : undefined,
        draw: createDraw(entity),
    };
};

// Make a create hover/start/endTransitions object from it, so entity doesn't need to get passed for every method?
// Make multiple wrappers: (1. combine for entity global object, 2. create update/start/stop dynamically, 1liner?)
const hoverTransitions = {
    bold: (entity: InternalEntity) => createBoldHoverTransitionUpdate(entity),
};

const startEndTransitions = {
    fadein1: (entity: InternalEntity) => createFadeIn1TransitionUpdate(entity),
    fadeout1: (entity: InternalEntity) => createFadeOut1TransitionUpdate(entity),
};

const animationUpdates = {
    noise: (entity: InternalEntity) => createNoiseUpdate(entity),
};

const createFadeIn1TransitionUpdate = ({colors: {fill, stroke, textFill}, properties: {id, name}}: InternalEntity) => ({
    id,
    name: `entity-fadein1-update${name}`,
    fn: () => {
        fill.a += 0.001;
        stroke.a += 0.001;
        textFill.a += 0.001;

        if (fill.a >= 1) {
            fill.a = 1;
            stroke.a = 1;
            textFill.a = 1;

            // callBack function();
        }
    },
});

const createFadeOut1TransitionUpdate = ({
    properties: {id, name},
    colors: {fill, stroke, textFill},
}: InternalEntity) => ({
    id,
    name: `entity-fadeout1-update${name}`,
    fn: () => {
        fill.a -= 0.001;
        stroke.a -= 0.001;
        textFill.a -= 0.001;

        if (fill.a <= 0) {
            // callBack function();
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
        sketch.x += upd.adj;

        upd.count++;

        if (upd.count > 60) {
            upd.adj *= -1;

            upd.count = 0;
        }
    },
});

const createDraw = (entity: InternalEntity) => createDrawShow(entity);

const createDrawShow = ({
    properties: {id, name},
    sketch,
    context: ctx,
    colors: {fill, stroke, textFill},
}: InternalEntity) => ({
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
});

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
    adj: 0.05,
    lw: 0,
    count: 0,
    max: 60,
    angle: 0,
};
