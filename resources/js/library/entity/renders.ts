import {Callbacks} from 'library/types/entity';

export const createRenders = (entity: EntityTemp, callbacks: Pick<Callbacks, 'startEnd' | 'endEnd'>) => {
    const {id, name} = entity.properties;

    const hovers = {
        bold: () => {
            const hover = createHoverBold(entity.sketch);

            return {
                update: {
                    id: id + '-hover',
                    name: `hover-bold-${name}`,
                    fn: createTransitionUpdate(entity, hover),
                },
            };
        },
    };

    const transitions = {
        fadein1: () => {
            const {update: fn, prepare} = createTransitionFadein1(
                entity.colors,
                0.005 * entity.visualProperties.startSpeed,
                callbacks,
            );

            return {
                update: {
                    id: id + '-fadein1',
                    name: `transition-fadein1-${name}`,
                    fn,
                },
                prepare,
            };
        },
        fadeout1: () => {
            const {update: fn, prepare} = createTransitionFadeout1(
                entity.colors,
                0.005 * entity.visualProperties.endSpeed,
                callbacks,
            );

            return {
                update: {
                    id: id + '-fadeout1',
                    name: `transition-fadeout1${name}`,
                    fn,
                },
                prepare,
            };
        },
        slideinleft: () => ({
            update: {
                id: id + '-slideinleft',
                name: `transition-slideinleft-${name}`,
                fn: createTransitionSlideinleft(),
            },
        }),
        explode: () => {
            const {update: fn, prepare} = createTransitionExplode(entity.colors, entity.sketch, callbacks);

            return {
                update: {
                    id: id + '-slideinleft',
                    name: `transition-slideinleft-${name}`,
                    fn,
                },
                prepare,
            };
        },
    };

    const animations = {
        noise: () => ({
            update: {
                id: id + '-noise',
                name: `animation-noise-${name}`,
                fn: createAnimationNoise(entity.sketch),
            },
        }),
    };

    const draw = {
        id: id + '-draw',
        name: `draw-${name}`,
        fn: createDraw(entity),
    };

    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createHoverBold = (sketch: EntitySketch) => {
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

const createTransitionFadein1 = (
    {fill, stroke, textFill}: EntityColors,
    alphaVelocity: number,
    callbacks: Pick<Callbacks, 'startEnd'>,
) => ({
    update: () => {
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) {
            // create endPrepare (finish) method for this and put in animate.ts
            fill.a = 1;
            stroke.a = 1;
            textFill.a = 1;

            callbacks.startEnd();
        }
    },
    prepare: () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;
    },
});

const createTransitionFadeout1 = (
    {fill, stroke, textFill}: EntityColors,
    alphaVelocity: number,
    callbacks: Pick<Callbacks, 'endEnd'>,
) => ({
    update: () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) {
            // create endPrepare (finish) method for this and put in animate.ts
            fill.a = 0;
            stroke.a = 0;
            textFill.a = 0;

            callbacks.endEnd();
        }
    },
    prepare: () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    },
});

const createTransitionSlideinleft = () => () => {
    //
};

const createTransitionExplode = (
    {fill, stroke, textFill}: EntityColors,
    sketch: EntitySketch,
    callbacks: Pick<Callbacks, 'endEnd'>,
) => ({
    update: () => {
        sketch.lw += 0.1;

        if (sketch.lw > 10) {
            //

            callbacks.endEnd();
        }
    },
    prepare: () => {
        //
    },
});

const createTransitionUpdate =
    ({input: {mouse}, sketch}: EntityTemp, transition: TransitionBase) =>
    () => {
        if (mouse.insideRect(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    };

const createAnimationNoise = (sketch: EntitySketch) => () => {
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
    ({sketch, context: ctx, colors: {fill, stroke, textFill}}: EntityTemp) =>
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
