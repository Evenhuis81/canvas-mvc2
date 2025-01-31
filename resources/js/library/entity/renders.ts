/* eslint-disable max-lines-per-function */
import type {Colors} from 'library/types/color';
import type {GeneralProperties, VisualProperties} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {Circle, Rect, ShapeMap, Text} from 'library/types/shapes';

export const createRenders = <K extends keyof ShapeMap>(
    props: GeneralProperties,
    sketchType: K,
    sketch: ShapeMap[K],
    colors: Colors,
    {startSpeed = 3, endSpeed = 3}: Partial<VisualProperties>,
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const {id, name} = props;

    const draw = createDraw(sketchType, sketch);

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
            const {update: fn, prepare} = createTransitionFadein1(colors, 0.005 * startSpeed, () => {});

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
            // TODO::Fill with end callback needs, implement outside of render module
            const callback = () => {};

            const {update: fn, prepare} = createTransitionFadeout1(colors, 0.005 * endSpeed, callback);

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
            const {update: fn, prepare} = createTransitionExplode(sketch, colors, () => {});

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
        fn: getDraw(sketch, context, colors),
    };

    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createHoverBold = (sketch: Shape) => {
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

const createTransitionFadein1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number, endCallback: () => void) => {
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

        endCallback();
    };

    return {update, prepare, end};
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number, callback: () => void) => {
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

        callback();
    };

    return {update, prepare, end};
};

const createTransitionSlideinleft = () => () => {
    //
};

let phase = 1;

const createTransitionExplode = (sketch: Shape, {fill, stroke, textFill}: Colors, callback: () => void) => {
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

                end();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    };

    const end = () => callback();

    const prepare = () => {};

    return {update, prepare, end};
};

const createTransitionUpdate =
    (
        {mouse}: LibraryInput, // only mouse, no hover on touch
        sketch: Shape,
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

const createAnimationNoise = (sketch: Shape) => () => {
    if (sketch.type === 'rect') {
        sketch.x += upd.adj.x;
        sketch.y += upd.adj.y;

        upd.count++;

        if (upd.count > 60) {
            upd.adj.x *= -1;
            upd.adj.y *= -1;

            upd.count = 0;
        }
    }
};

const createDraw = <K extends keyof ShapeMap>(type: K, sketch: ShapeMap[K]) => {
    return;
};

// TODO::Create seperate module and abstract this one into multiple shape renders
// (sketch: Shape, c: CanvasRenderingContext2D, {fill, stroke, textFill}: Colors)

const createGetDraw = {
    rect: (sketch: ShapeMap['rect'], ctx: CanvasRenderingContext2D, {fill, stroke, textFill}: Colors) => {
        ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
        ctx.lineWidth = sketch.lineWidth;

        ctx.beginPath();
        ctx.rect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
        ctx.font = `${sketch.fontSize}px ${sketch.font}`;

        ctx.textAlign = sketch.textAlign;
        ctx.textBaseline = sketch.textBaseLine;

        ctx.beginPath();
        ctx.fillText(sketch.text, sketch.x, sketch.y + 1.5);
    },
    circle: (sketch: ShapeMap['circle'] & Text) => {
        c.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        c.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
        c.lineWidth = sketch.lineWidth;

        c.beginPath();
        // c.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.radii);
        c.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        c.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
        c.font = `${sketch.fontSize}px ${sketch.font}`;

        c.textAlign = sketch.textAlign;
        c.textBaseline = sketch.textBaseLine;

        c.beginPath();
        c.fillText(sketch.text, sketch.x, sketch.y + 1.5);
    },
    line: () => {},
    roundRect: () => {},
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
