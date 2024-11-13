/* eslint-disable max-lines-per-function */
import {Callbacks, Colors, GeneralProperties, VisualProperties} from 'library/types/entity';
import {Sketch} from 'library/types/entityShapes';
import {Input} from 'library/types/input';

export const createRenders = (
    props: GeneralProperties,
    sketch: Sketch,
    colors: Colors,
    vProps: VisualProperties,
    input: Input,
    context: CanvasRenderingContext2D,
    callbacks: Pick<Callbacks, 'startEnd' | 'endEnd'>,
) => {
    const {id, name} = props;

    const hovers = {
        bold: () => {
            const hover = createHoverBold(sketch);

            return {
                update: {
                    id: `${id}-hover`,
                    name: `hover-bold-${name}`,
                    fn: createTransitionUpdate(input, sketch, hover),
                },
            };
        },
    };

    const transitions = {
        fadein1: () => {
            const {update: fn, prepare} = createTransitionFadein1(colors, 0.005 * vProps.startSpeed, callbacks);

            return {
                update: {
                    id: `${id}-fadein1`,
                    name: `transition-fadein1-${name}`,
                    fn,
                },
                prepare,
            };
        },
        fadeout1: () => {
            const {update: fn, prepare} = createTransitionFadeout1(colors, 0.005 * vProps.endSpeed, callbacks);

            return {
                update: {
                    id: `${id}-fadeout1`,
                    name: `transition-fadeout1${name}`,
                    fn,
                },
                prepare,
            };
        },
        slideinleft: () => ({
            update: {
                id: `${id}-slideinleft`,
                name: `transition-slideinleft-${name}`,
                fn: createTransitionSlideinleft(),
            },
        }),
        explode: () => {
            const {update: fn, prepare} = createTransitionExplode(sketch, colors, callbacks);

            return {
                update: {
                    id: `${id}-slideinleft`,
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
                id: `${id}-noise`,
                name: `animation-noise-${name}`,
                fn: createAnimationNoise(sketch),
            },
        }),
    };

    const draw = {
        id: `${id}-draw`,
        name: `draw-${name}`,
        fn: createDraw(sketch, context, colors),
    };

    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createHoverBold = (sketch: Sketch) => {
    const origin = {
        lineWidth: sketch.lineWidth,
        f: sketch.fontSize,
    };

    const steps = 30;
    const lwAdj = 0.1;
    const fAdj = lwAdj / 2;
    const lwRange = lwAdj * steps;
    const fRange = lwRange / 2;

    const forward = () => {
        sketch.lineWidth += lwAdj;
        sketch.fontSize += fAdj;

        if (sketch.lineWidth > origin.lineWidth + lwRange) {
            sketch.lineWidth = origin.lineWidth + lwRange;
            sketch.fontSize = origin.f + fRange;
        }
    };

    const reverse = () => {
        sketch.lineWidth -= lwAdj;
        sketch.fontSize -= fAdj;

        if (sketch.lineWidth < origin.lineWidth) {
            sketch.lineWidth = origin.lineWidth;
            sketch.fontSize = origin.f;
        }
    };

    return {forward, reverse};
};

const createTransitionFadein1 = (
    {fill, stroke, textFill}: Colors,
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
    {fill, stroke, textFill}: Colors,
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

let phase = 1;

const createTransitionExplode = (
    sketch: Sketch,
    {fill, stroke, textFill}: Colors,
    callbacks: Pick<Callbacks, 'endEnd'>,
) => ({
    update: () => {
        if (phase === 1) sketch.lineWidth += 0.1;
        else if (phase === 2) {
            fill.a -= 0.01;
            stroke.a -= 0.01;
            textFill.a -= 0.01;

            if (fill.a < 0) {
                fill.a -= 0;
                stroke.a -= 0;
                textFill.a -= 0;

                callbacks.endEnd();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    },
    prepare: () => {
        //
    },
});

const createTransitionUpdate =
    (
        {mouse}: Input,
        sketch: Sketch,
        transition: {
            forward: () => void;
            reverse: () => void;
        },
    ) =>
    () => {
        if (mouse.insideRect(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    };

const createAnimationNoise = (sketch: Sketch) => () => {
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
    (sketch: Sketch, c: CanvasRenderingContext2D, {fill, stroke, textFill}: Colors) =>
    () => {
        c.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        c.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
        c.lineWidth = sketch.lineWidth;

        c.beginPath();
        c.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.radii);
        c.fill();
        c.stroke();

        c.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
        c.font = `${sketch.fontSize}px ${sketch.font}`;

        c.textAlign = sketch.textAlign;
        c.textBaseline = sketch.textBaseLine;

        c.beginPath();
        c.fillText(sketch.text, sketch.x, sketch.y + 1.5);
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
