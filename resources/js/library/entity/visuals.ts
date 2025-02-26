import {Visual, VisualCallbacks, VisualProperties} from 'library/types/entity';
import {EntityColor, EntitySketchMap} from 'library/types/entitySketch';
import {LibraryInput} from 'library/types/input';
import {Visual, VisualCallbacks, VisualProperties} from 'library/types/entity';

export const getCreateVisual = (
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    {startSpeed = 3, endSpeed = 3}: Partial<VisualProperties>,
) => ({
    noise: () => createAnimationNoise(sketch),
    bold: () => createTransition(createHoverBold(sketch), sketch, input),
    fadein1: () => createTransitionFadein1(sketch.color, 0.005 * startSpeed),
    fadeout1: () => createTransitionFadeout1(sketch.color, 0.005 * endSpeed),
    explode: () => createTransitionExplode(sketch),
});

const createAnimationNoise = (sketch: EntitySketchMap['button1']): Visual => ({
    render: () => {
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
    },
});

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

    const returnObject = {forward, reverse};

    return returnObject;
};

const createTransition: (
    transition: {forward: () => void; reverse: () => void},
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
) => Visual = (
    {forward, reverse},
    sketch,
    {mouse}, // hover is only for mouse
) => ({
    render: () => {
        if (mouse.insideShape(sketch)) return forward();

        return reverse();
    },
});

const createTransitionFadein1 = ({fill, stroke, textFill}: EntityColor['button1'], alphaVelocity: number): Visual => {
    const render = () => {
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) post();
    };

    const pre = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;
    };

    const post = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    };

    return {render, pre, post};
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: EntityColor['button1'], alphaVelocity: number): Visual => {
    const render = () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) post();
    };

    const pre = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    };

    const post = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;
    };

    return {render, pre, post};
};

const createTransitionExplode = (sketch: EntitySketchMap['button1']): Visual => {
    const {fill, stroke, textFill} = sketch.color;
    let phase = 1;

    const render = () => {
        if (phase === 1) sketch.lineWidth += 0.1;
        else if (phase === 2) {
            fill.a -= 0.01;
            stroke.a -= 0.01;
            textFill.a -= 0.01;

            if (fill.a < 0) {
                fill.a -= 0;
                stroke.a -= 0;
                textFill.a -= 0;

                // callbacks.endOfEnd();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    };

    return {render};
};

export const createSketchDraw = (c: CanvasRenderingContext2D, sketch: EntitySketchMap['button1']) => () => {
    const {fill, stroke, textFill} = sketch.color;

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
