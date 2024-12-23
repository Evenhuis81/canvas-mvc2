import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas, engine} = resources[libraryID];

    let interval = Math.random() * 500 + 100; // 250 - 750 ms;

    const dotTimeout = () => {
        setTimeout(() => {
            startDemo();
            dotTimeout();
        }, interval);

        interval = Math.random() * 500 + 100;
    };
    dotTimeout();

    const startDemo = () => {
        const phaser = createPhaser(engine);

        const {draw, preDraw, postDraw, removeDraw, sketch} = createDotPhaserDraw(canvas, context);

        phaser.setDraw([draw, preDraw, postDraw, removeDraw]);

        const durations = createRandomDurations();
        createDotPhases(sketch).forEach((phase, index) => {
            phase.duration = durations[index];
            phaser.setPhase([phase.duration, phase.update, phase.pre, phase.post]);
        });

        phaser.start();
    };
};

const createRandomDurations = () => {
    const durations = [250, 125, 50, 50, 500];
    const factor = Math.random() + 0.5;
    const newDurations: number[] = [];
    durations.forEach(duration => newDurations.push(duration * factor));

    return newDurations;
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        preDraw: () => {
            sketch.x = canvas.width * Math.random();
            sketch.y = canvas.height * Math.random();
            sketch.origin.radius = Math.random() * 8 + 2;
            sketch.origin.lineWidth = Math.random() * 4 + 2;
            sketch.fill.r = Math.random() * 255;
            sketch.fill.g = Math.random() * 255;
            sketch.fill.b = Math.random() * 255;
            sketch.stroke.r = Math.random() * 255;
            sketch.stroke.g = Math.random() * 255;
            sketch.stroke.b = Math.random() * 255;
        },
        postDraw: undefined,
        // postDraw: (evt: PhaserEvent) => {
        //     evt.destroyPhaser();

        //     console.log('postDraw destroyPhaser triggered');
        // },
        removeDraw: true,
        draw,
        sketch,
    };
};

const createDotPhases: (sketch: DotSketch) => DotPhases = sketch => [
    {
        duration: 0,
        update: (evt: EngineUpdateEvent) => {
            sketch.radius = sketch.origin.radius * evt.phasePercentage;
            sketch.lineWidth = (sketch.origin.lineWidth - 1) * evt.phasePercentage + 1;
        },
        pre: () => (sketch.lineWidth = 1),
        post: () => {
            sketch.radius = sketch.origin.radius;
            sketch.lineWidth = sketch.origin.lineWidth;
        },
    },
    {
        duration: 0,
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
        duration: 0,
        update: (evt: EngineUpdateEvent) => (sketch.stroke.a = evt.phasePercentage),
        post: () => (sketch.stroke.a = 1),
    },
    {
        duration: 0,
        update: (evt: EngineUpdateEvent) => (sketch.fill.a = evt.phasePercentageReverse),
        post: () => (sketch.fill.a = 0),
    },
    {
        duration: 0,
        update: (evt: EngineUpdateEvent) => {
            sketch.radius = sketch.origin.radius * evt.phasePercentageReverse;
            sketch.lineWidth = sketch.lineWidth = (sketch.origin.lineWidth - 1) * evt.phasePercentageReverse + 1;
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
    origin: {
        radius: 20,
        lineWidth: 4,
    },
};
