import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const {draw, preDraw, postDraw, removeDraw, sketch} = createDotPhaserDraw(canvas, context);

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);

    createDotPhases(sketch).forEach(phase => {
        phaser.setPhase([phase.duration, phase.update, phase.pre, phase.post]);
    });

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        preDraw: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;
        },
        postDraw: () => {},
        removeDraw: false,
        draw,
        sketch,
    };
};

const dotOrigin = {
    radius: 20,
    lineWidth: 4,
};

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    {
        duration: 2000,
        update: (evt: EngineUpdateEvent) => {
            sketch.radius = dotOrigin.radius * evt.phasePercentage;
            sketch.lineWidth = (dotOrigin.lineWidth - 1) * evt.phasePercentage + 1;
        },
        pre: () => (sketch.lineWidth = 1),
        post: () => {
            sketch.radius = dotOrigin.radius;
            sketch.lineWidth = dotOrigin.lineWidth;
        },
    },
    {
        duration: 1000,
        update: (evt: EngineUpdateEvent) => {
            sketch.stroke.a = evt.phasePercentageReverse;
            sketch.fill.a = evt.phasePercentage;
        },
        post: () => {
            sketch.stroke.a = 0;
            sketch.fill.a = 1;
        },
    },
    {
        duration: 500,
        update: (evt: EngineUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        post: () => (sketch.stroke.a = 1),
    },
    {
        duration: 500,
        update: (evt: EngineUpdateEvent) => (sketch.fill.a = evt.phasePercentageReverse),
        post: () => (sketch.fill.a = 0),
    },
    {
        duration: 3000,
        update: (evt: EngineUpdateEvent) => {
            sketch.radius = dotOrigin.radius * evt.phasePercentageReverse;
            sketch.lineWidth = sketch.lineWidth = (dotOrigin.lineWidth - 1) * evt.phasePercentageReverse + 1;
            console.log(sketch.lineWidth);
        },
        post: () => (sketch.radius = 0),
    },
];

const createDotDrawBucket = (ctx: CanvasRenderingContext2D) => {
    const sketch = {...dotSketch};
    const fill = {...dotSketch.fill};
    const stroke = {...dotSketch.stroke};

    return {
        draw: {
            id: 'dot-draw',
            name: 'Dot Draw Sketch',
            fn: () => {
                ctx.lineWidth = sketch.lineWidth;
                ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
                ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

                ctx.beginPath();
                ctx.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            },
        },
        sketch: Object.assign(sketch, {fill, stroke}),
    };
};

export type DotSketch = typeof dotSketch;

export type DotPhases = {
    duration: number;
    update: (evt: EngineUpdateEvent) => void;
    pre?: Function;
    post?: Function;
}[];

const dotSketch = {
    x: 0,
    y: 0,
    radius: 0,
    lineWidth: 0,
    stroke: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
    fill: {
        r: 175,
        g: 175,
        b: 0,
        a: 0,
    },
};
