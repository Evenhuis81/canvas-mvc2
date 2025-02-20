import type {Colors} from 'library/types/color';
import type {EngineDrawConfig} from 'library/types/engine';
import type {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';
import type {LibraryInput} from 'library/types/input';

const sketchDraw = (c: CanvasRenderingContext2D, sketch: EntitySketchMap['button1']) => () => {
    const {fill, stroke, textFill} = sketch.color;

    //

    c.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
    c.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
    c.lineWidth = sketch.lineWidth;

    c.beginPath();
    c.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.radii);
    c.fill();
    c.stroke();

    c.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
    c.font = `${sketch.fontSize}px ${sketch.font}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.beginPath();
    c.fillText(sketch.text, sketch.x, sketch.y + 1.5); // TODO::use textAscend / -descent
};

const createDraw = (context: CanvasRenderingContext2D, sketch: EntitySketchMap['button1']): EngineDrawConfig => {
    return {
        id: `${sketch.type}-draw`,
        name: `${sketch.type} Draw`,
        fn: sketchDraw(context, sketch),
    };
};

export const createRenders = (
    props: GeneralProperties,
    sketch: EntitySketchMap['button1'],
    {startSpeed = 3, endSpeed = 3}: Partial<VisualProperties>,
    input: LibraryInput,
    context: CanvasRenderingContext2D,
    // eventHandler: EventHandler,
) => {
    const {id, name} = props;

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
            const {update: fn, prepare, callback} = createTransitionFadein1(sketch.color, 0.005 * startSpeed);

            return {
                update: {
                    id: `${id}-fadein1`,
                    name: `transition-fadein1-${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
        fadeout1: () => {
            const {update: fn, prepare, callback} = createTransitionFadeout1(sketch.color, 0.005 * endSpeed);

            return {
                update: {
                    id: `${id}-fadeout1`,
                    name: `transition-fadeout1${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
        explode: () => {
            const {update: fn, prepare, callback} = createTransitionExplode(sketch, sketch.color);

            return {
                update: {
                    id: `${id}-slideinleft`,
                    name: `transition-slideinleft-${name}`,
                    fn,
                    callback,
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

const createHoverBold = (sketch: EntitySketchMap['button1']) => {
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

const createTransitionFadein1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number) => {
    const callback = () => {
        console.log('callback fadein1');
    };

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

        // console.log('endOfStart in fadein1');
        // callbacks.endOfStart.fn();
        callback();
    };

    return {update, prepare, end, callback};
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number) => {
    const callback = () => {
        console.log('callback fadeout1');
    };

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

        // console.log('endOFEnd');
        // callbacks.endOfEnd.fn();
        callback();
    };

    return {update, prepare, end, callback};
};

let phase = 1;

const createTransitionExplode = (sketch: EntitySketchMap['button1'], {fill, stroke, textFill}: Colors) => {
    const callback = () => {
        console.log('callback explode');
    };

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

                // callbacks.endOfEnd.fn();
                callback();
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

    return {update, prepare, end, callback};
};

const createTransitionUpdate =
    (
        {mouse}: LibraryInput, // only mouse, no hover on touch
        sketch: EntitySketchMap['button1'],
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

const createAnimationNoise = (sketch: EntitySketchMap['button1']) => () => {
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
