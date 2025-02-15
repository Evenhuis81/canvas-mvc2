import type {Colors} from 'library/types/color';
import type {EngineDrawConfig} from 'library/types/engine';
import type {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';
import type {EntityShapeMap, EntityShapeMapComplete} from 'library/types/entitySketch';
import type {LibraryInput} from 'library/types/input';

// ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
// ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
// ctx.lineWidth = sketch.lineWidth;

// ctx.beginPath();
// ctx.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.radii);
// ctx.fill();
// ctx.stroke();

// ctx.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
// ctx.font = `${sketch.fontSize}px ${sketch.font}`;

// ctx.textAlign = sketch.textAlign;
// ctx.textBaseline = sketch.textBaseLine;

// ctx.beginPath();
// ctx.fillText(sketch.text, sketch.x, sketch.y + 1.5); // adjustment needs be baked in

const createDrawSketches = (context: CanvasRenderingContext2D) => ({
    button1: () => {},
    circle1: () => {},
    rect1: () => {},
});

const createDraw = <T extends keyof EntityShapeMap>(
    context: CanvasRenderingContext2D,
    sketch: EntityShapeMapComplete<T>[T],
): EngineDrawConfig => {
    const drawSketches = createDrawSketches(context);

    return {
        id: 'b1Draw',
        name: 'b1 Draw (hardcoded)',
        fn: () => {},
    };
};

export const createRenders = <T extends keyof EntityShapeMap>(
    props: GeneralProperties,
    sketch: EntityShapeMapComplete<T>[T],
    {startSpeed = 3, endSpeed = 3}: Partial<VisualProperties>,
    input: LibraryInput,
    context: CanvasRenderingContext2D,
    eventHandler: EventHandler,
) => {
    const {id, name} = props;

    // const draw = createB1Draw(context, sketch, sketch.colors);
    const draw = createDraw(context, sketch);

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
            const {update: fn, prepare} = createTransitionFadein1(
                sketch.colors,
                0.005 * startSpeed,
                eventHandler.callbacks,
            );

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
            const {update: fn, prepare} = createTransitionFadeout1(
                sketch.colors,
                0.005 * endSpeed,
                eventHandler.callbacks,
            );

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
            const {update: fn, prepare} = createTransitionExplode(sketch, sketch.colors, eventHandler.callbacks);

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

    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createHoverBold = <T extends keyof EntityShapeMap>(sketch: EntityShapeMapComplete<T>[T]) => {
    const origin = {
        lineWidth: sketch.lineWidth,
        f: sketch.sketchType === 'button1' ? sketch.fontSize : 16,
    };

    const steps = 30;
    const lwAdj = 0.1;
    const fAdj = lwAdj / 2;
    const lwRange = lwAdj * steps;
    const fRange = lwRange / 2;

    const forward = () => {
        sketch.lineWidth += lwAdj;
        sketch.sketchType === 'button1' ? (sketch.fontSize += fAdj) : '';

        if (sketch.lineWidth > origin.lineWidth + lwRange) {
            sketch.lineWidth = origin.lineWidth + lwRange;
            sketch.sketchType === 'button1' ? (sketch.fontSize = origin.f + fRange) : '';
        }
    };

    const reverse = () => {
        sketch.lineWidth -= lwAdj;
        sketch.sketchType === 'button1' ? (sketch.fontSize -= fAdj) : '';

        if (sketch.lineWidth < origin.lineWidth) {
            sketch.lineWidth = origin.lineWidth;
            sketch.sketchType === 'button1' ? (sketch.fontSize = origin.f) : '';
        }
    };

    return {forward, reverse};
};

const createTransitionFadein1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number, callbacks: Callbacks) => {
    const update = () => {
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) end();
    };

    const prepare = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;
    };

    const end = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;

        callbacks.endOfStart();
    };

    return {update, prepare, end};
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number, callbacks: Callbacks) => {
    const update = () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) end();
    };

    const prepare = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    };

    const end = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;

        callbacks.endOfEnd();
    };

    return {update, prepare, end};
};

const createTransitionSlideinleft = () => () => {
    //
};

let phase = 1;

const createTransitionExplode = (
    sketch: EntityShapeMap['button1'],
    {fill, stroke, textFill}: Colors,
    callbacks: Callbacks,
) => {
    const update = () => {
        if (phase === 1) sketch.lineWidth += 0.1;
        else if (phase === 2) {
            fill.a -= 0.01;
            stroke.a -= 0.01;
            textFill.a -= 0.01;

            if (fill.a < 0) {
                fill.a -= 0;
                stroke.a -= 0;
                textFill.a -= 0;

                callbacks.endOfEnd();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    };

    // Figure out what this one does
    const end = () => {};

    const prepare = () => {};

    return {update, prepare, end};
};

const createTransitionUpdate =
    <T extends keyof EntityShapeMap>(
        {mouse}: LibraryInput, // only mouse, no hover on touch
        sketch: EntityShapeMapComplete<T>[T],
        transition: {
            forward: () => void;
            reverse: () => void;
        },
    ) =>
    () => {
        if (mouse.inside(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    };

const createAnimationNoise =
    <T extends keyof EntityShapeMap>(sketch: EntityShapeMapComplete<T>[T]) =>
    () => {
        sketch.x += upd.adj.x;
        sketch.y += upd.adj.y;

        upd.count++;

        if (upd.count > 60) {
            upd.adj.x *= -1;
            upd.adj.y *= -1;

            upd.count = 0;
        }
    };

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
