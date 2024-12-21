import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';
import {PhaserEvent} from '../types';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(engine);

    const {draw, preDraw, postDraw, removeDraw, sketch} = createDotPhaserDraw(canvas, context);

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);

    createDotPhases(sketch).forEach(phase => phaser.setPhase([phase.duration, phase.update, phase.pre, phase.post]));

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        preDraw: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;
        },
        postDraw: (evt: PhaserEvent) => {
            evt.destroyPhaser();

            console.log('postDraw destroyPhaser triggered');
        },
        removeDraw: true,
        draw,
        sketch,
    };
};

const dotOrigin = {
    radius: 20,
    lineWidth: 4,
};

const durations = [2000, 1000, 500, 500, 3000];

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    {
        duration: durations[0],
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
        duration: durations[1],
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
        duration: durations[2],
        update: (evt: EngineUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        post: () => (sketch.stroke.a = 1),
    },
    {
        duration: durations[3],
        update: (evt: EngineUpdateEvent) => (sketch.fill.a = evt.phasePercentageReverse),
        post: () => (sketch.fill.a = 0),
    },
    {
        duration: durations[4],
        update: (evt: EngineUpdateEvent) => {
            sketch.radius = dotOrigin.radius * evt.phasePercentageReverse;
            sketch.lineWidth = sketch.lineWidth = (dotOrigin.lineWidth - 1) * evt.phasePercentageReverse + 1;
        },
        post: () => {
            sketch.radius = 0;
            sketch.lineWidth = 1;
        },
    },
];

const createDotDrawBucket = (ctx: CanvasRenderingContext2D) => {
    const sketch = {...dotSketch};
    const fill = {...dotSketch.fill};
    const stroke = {...dotSketch.stroke};

    return {
        draw: () => {
            ctx.lineWidth = sketch.lineWidth;
            ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
            ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

            ctx.beginPath();
            ctx.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        },
        sketch: Object.assign(sketch, {fill, stroke}),
    };
};

export type DotSketch = typeof dotSketch;

export type DotPhases = {
    duration: number;
    update?: (evt: EngineUpdateEvent) => void;
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
