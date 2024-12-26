import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {PhaserUpdateEvent} from '../types';

export const startDotDemoPhaser2 = (libraryID: string | number) => {
    const {context, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(engine);

    const {type, sketch, ...draw} = createDotPhaserDraw(canvas, context);

    phaser.setDraw(draw);

    createDotPhases(sketch).forEach(phase => phaser.setPhase(phase));

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        type: 'draw',
        preDraw: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;
            sketch.stroke.a = 0;
            console.log('preDraw');
        },
        postDraw: () => {
            console.log('postDraw');
        },
        removeDraw: false,
        draw,
        sketch,
    };
};

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    // {
    //     duration: 2000, // only duration acts like a pauze
    // },
    {
        duration: 5000,
        update: (evt: PhaserUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        post: () => (sketch.stroke.a = 1),
    },
    // {
    // startAt: 4500,
    // duration: 2500,
    // update: () => {
    //     console.log('startAt 4500 running');
    // },
    // },
    {
        duration: 5000,
        update: (evt: PhaserUpdateEvent) => {
            sketch.stroke.g = 255 * evt.phasePercentageReverse;
            sketch.stroke.b = 255 * evt.phasePercentageReverse;
            sketch.lineWidth = 4 * evt.phasePercentage + 2;
        },
        pre: () => {
            console.log('prePhase2');
        },
        post: () => {
            console.log('postPhase2');
        },
    },
    {
        duration: 5000,
        update: () => {
            console.log('phase 3 running');
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
            // ctx.fill();
            ctx.stroke();
        },
        // sketch: Object.assign(sketch, {fill, stroke}),
        sketch: Object.assign(sketch, {stroke}),
    };
};

export type DotSketch = typeof dotSketch;

export type DotPhases = {
    duration: number;
    update?: (evt: PhaserUpdateEvent) => void;
    pre?: () => void;
    post?: () => void;
    // startAt?: number;
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
