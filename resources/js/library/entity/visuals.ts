import {EngineDraw} from 'library/types/engine';
import {VisualConfig, VisualCreation} from 'library/types/entity';
import {EntitySketchMap} from 'library/types/entitySketch';
import {LibraryInput} from 'library/types/input';

const noise: VisualConfig = {
    visualType: 'animation',
    effectType: 'noise',
    get: sketch => {
        const adjust = {x: 0.5, y: 0.5};
        let count = 0;

        return {
            render: () => {
                sketch.x += adjust.x;
                sketch.y += adjust.y;

                count++;

                if (count > 60) {
                    adjust.x *= -1;
                    adjust.y *= -1;

                    count = 0;
                }
            },
        };
    },
};

const enlargeTransition = (sketch: EntitySketchMap['button']) => {
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

const enlarge: VisualConfig = {
    visualType: 'hover',
    effectType: 'enlarge', // change to enlarge
    get: (sketch, next, input) => {
        const transition = enlargeTransition(sketch);

        return createTransition(transition, sketch, input);
    },
};

const createTransition: (
    transition: {forward: () => void; reverse: () => void},
    sketch: EntitySketchMap['button'],
    input: LibraryInput,
) => VisualCreation = (
    {forward, reverse},
    sketch,
    {mouse}, // hover is only for mouse
) => ({
    render: () => {
        if (mouse.insideShape(sketch)) return forward();

        return reverse();
    },
});

const fadein: VisualConfig = {
    visualType: 'start',
    effectType: 'fadein',
    get: (sketch, next) => {
        const {fill, stroke, textFill} = sketch.color;
        const alphaVelocity = 0.05;

        return {
            render: () => {
                fill.a += alphaVelocity;
                stroke.a += alphaVelocity;
                textFill.a += alphaVelocity;

                if (fill.a >= 1) next();
            },
            pre: () => {
                fill.a = 0;
                stroke.a = 0;
                textFill.a = 0;
            },
            post: () => {
                fill.a = 1;
                stroke.a = 1;
                textFill.a = 1;
            },
        };
    },
};

const fadeout: VisualConfig = {
    visualType: 'start',
    effectType: 'fadein',
    get: (sketch, next) => {
        const {fill, stroke, textFill} = sketch.color;
        const alphaVelocity = 0.05;

        return {
            render: () => {
                fill.a -= alphaVelocity;
                stroke.a -= alphaVelocity;
                textFill.a -= alphaVelocity;

                if (fill.a <= 0) next();
            },
            pre: () => {
                fill.a = 1;
                stroke.a = 1;
                textFill.a = 1;
            },
            post: () => {
                fill.a = 0;
                stroke.a = 0;
                textFill.a = 0;
            },
        };
    },
};

const explode: VisualConfig = {
    visualType: 'end',
    effectType: 'explode',
    get: (sketch, next) => {
        const {fill, stroke, textFill} = sketch.color;
        const alphaVelocity = 0.05;
        let phase = 1;

        return {
            render: () => {
                if (phase === 1) sketch.lineWidth += 0.1;
                else if (phase === 2) {
                    fill.a -= 0.01;
                    stroke.a -= 0.01;
                    textFill.a -= 0.01;

                    if (fill.a < 0) {
                        fill.a -= 0;
                        stroke.a -= 0;
                        textFill.a -= 0;

                        next();
                    }
                }

                if (sketch.lineWidth > 10) {
                    sketch.lineWidth = 10;

                    phase = 2;
                }
            },
        };
    },
};

export const createVisual = {
    noise,
    enlarge,
    fadein,
    fadeout,
    explode,
};

export const createSketchDraw =
    (c: CanvasRenderingContext2D, sketch: EntitySketchMap['button']): EngineDraw['fn'] =>
    () => {
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
