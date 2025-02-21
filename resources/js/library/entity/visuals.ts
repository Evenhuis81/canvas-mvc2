import {GeneralProperties, VisualProperties} from 'library/types/entity';
import {EntitySketchMap} from 'library/types/entitySketch';
import {LibraryInput} from 'library/types/input';

export const getCreateVisual = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    ctx: CanvasRenderingContext2D,
) => ({
    noise: () => createAnimationNoise(sketch),
    bold: () => createTransitionUpdate(createHoverBold(sketch, input)),
    fadein1: () => createHoverBold(sketch),
    fadeout1: () => createHoverBold(sketch),
    explode: () => createHoverBold(sketch),
});

const createAnimationNoise = (sketch: EntitySketchMap['button1']) => () => {
    const upd = {
        adj: {
            x: 0.5,
            y: 0.5,
        },
        count: 0,
    };

    sketch.x += upd.adj.x;
    sketch.y += upd.adj.y;

    upd.count++;

    if (upd.count > 60) {
        upd.adj.x *= -1;
        upd.adj.y *= -1;

        upd.count = 0;
    }
};

const createHoverBold = (sketch: EntitySketchMap['button1'], input: LibraryInput) => {
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

    return {forward, reverse, sketch, input};
};

type ArgsType = [() => void, () => void, EntitySketchMap['button1'], LibraryInput];

const createTransitionUpdate =
    ([...args]: ArgsType) =>
    () => {
        if (mouse.inside(sketch)) return forward();

        return reverse();
    };

// const hovers = {
//     bold: () => {
//         const hover = createHoverBold(sketch);

//         return {
//             update: {
//                 id: `${id}-hover`,
//                 name: `hover-bold-${name}`,
//                 fn: createTransitionUpdate(input, sketch, hover),
//             },
//         };
//     },
// };

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
    c.textAlign = sketch.textAlign;
    c.textBaseline = sketch.textBaseLine;

    c.beginPath();
    c.fillText(sketch.text, sketch.x, sketch.y + 1.5); // TODO::use textAscend / -descent
};

const createDraw = (context: CanvasRenderingContext2D, sketch: EntitySketchMap['button1']) => {
    return {
        type: 'draw',
        id: `${sketch.type}-draw`,
        name: `${sketch.type} Draw`,
        fn: sketchDraw(context, sketch),
    };
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
    count: 0,
    lw: 0,
    max: 60,
    angle: 0,
};
