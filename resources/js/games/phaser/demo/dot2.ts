import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';
import {PhaserEvent} from '../types';

export const startDotDemoPhaser2 = (libraryID: string | number) => {
    const {context, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(engine);

    const {draw, preDraw, postDraw, removeDraw, sketch} = createDotPhaserDraw(canvas, context);

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);

    createDotPhases(sketch).forEach(phase =>
        phaser.setPhase([phase.duration, phase.update, phase.pre, phase.post, phase.startAt]),
    );

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        preDraw: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;
            sketch.stroke.a = 0;
        },
        postDraw: (evt: PhaserEvent) => {
            //
        },
        removeDraw: false,
        draw,
        sketch,
    };
};

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    {
        duration: 2000, // just duration acts like a pauze
    },
    {
        duration: 5000,
        update: (evt: EngineUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        post: () => (sketch.stroke.a = 1),
    },
    {
        startAt: 4500,
        duration: 2500,
        update: () => {
            console.log('startAt 4500 running');
        },
    },
];

const createDotDrawBucket = (ctx: CanvasRenderingContext2D) => {
    const sketch = {...dotSketch};
    // const fill = {...dotSketch.fill};
    const stroke = {...dotSketch.stroke};

    return {
        draw: () => {
            ctx.lineWidth = sketch.lineWidth;
            ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
            // ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

            ctx.beginPath();
            ctx.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        },
        // sketch: Object.assign(sketch, {fill, stroke}),
        sketch: Object.assign(sketch, {stroke}),
    };
};

export type DotSketch = typeof dotSketch;

export type DotPhases = {
    duration: number;
    update?: (evt: EngineUpdateEvent) => void;
    pre?: () => void;
    post?: () => void;
    startAt?: number;
}[];

const dotSketch = {
    x: 0,
    y: 0,
    radius: 20,
    lineWidth: 2,
    stroke: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
};
