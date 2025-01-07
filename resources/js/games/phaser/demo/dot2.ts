import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {PhaserUpdateEvent} from '../types';

export const startDotDemoPhaser2 = (libraryID: string | number) => {
    const {context, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(engine);

    const {sketch, ...draw} = createDotPhaserDraw(canvas, context);

    phaser.setDraw(draw);

    const durationSpeedFactor = 2;

    createDotPhases(sketch).forEach(phase => {
        phase.duration = phase.duration / durationSpeedFactor;
        phaser.setPhase(phase);
    });

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        pre: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;
            sketch.stroke.a = 0;

            console.log('preDraw');
        },
        post: () => {
            console.log('postDraw');
        },
        remove: true,
        draw,
        sketch,
    };
};

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    {
        duration: 2000, // only duration acts like a pauze
        pre: () => console.log('prePhase 1, duration only 2000ms / speedFactor'),
    },
    {
        duration: 3000,
        update: (evt: PhaserUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        pre: () => console.log('prePhase 2'),
        post: () => {
            sketch.stroke.a = 1;

            console.log('postPhase 2');
        },
    },
    {
        duration: 4000,
        update: (evt: PhaserUpdateEvent) => {
            sketch.stroke.g = 255 * evt.phasePercentageReverse;
            sketch.stroke.b = 255 * evt.phasePercentageReverse;
            sketch.lineWidth = 4 * evt.phasePercentage + 2;
        },
        pre: () => {
            console.log('prePhase 3');
        },
        post: () => {
            console.log('postPhase 3');
            sketch.stroke.g = 0;
            sketch.stroke.b = 0;
            sketch.lineWidth = 6;
        },
    },
    {
        duration: 2000,
        update: () => {
            console.log('phase 4 running');
        },
        post: () => console.log('postPhase 4'),
    },
];

const createDotDrawBucket = (ctx: CanvasRenderingContext2D, type?: 'fill' | 'stroke' | 'fillStroke') => {
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
            // ctx.fill();
            ctx.stroke();
        },
        // sketch: Object.assign(sketch, {fill, stroke}),
        sketch: Object.assign(sketch, {stroke}),
    };
};

export type DotPhases = {
    duration: number;
    update?: (evt: PhaserUpdateEvent) => void;
    pre?: () => void;
    post?: () => void;
}[];

export type DotSketch = typeof dotSketch;

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
