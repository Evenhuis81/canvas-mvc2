import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import {EngineUpdateEvent} from 'library/types/engine';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const {draw, preDraw, postDraw, removeDraw, sketch} = createDotPhaserDraw(canvas, context);

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);

    const dotPhases = createDotPhases();

    // dotPhases.forEach(phase => {

    // })

    phaser.start();
};

const createDotPhases = () => {
    // const {duration1, update1, prePhase1, postPhase1} = createDotPhase1(sketch);
    // const {duration2, update2, prePhase2, postPhase2} = createDotPhase2(sketch);
    // const {duration3, update3, prePhase3, postPhase3} = createDotPhase3(sketch);
    // const {duration4, update4, prePhase4, postPhase4} = createDotPhase4(sketch);
    // phaser.setDraw([draw, preDraw, postDraw, removeDraw]);
    // phaser.setPhase([duration1, update1, prePhase1, postPhase1]);
    // phaser.setPhase([duration2, update2, prePhase2, postPhase2]);
    // phaser.setPhase([duration3, update3, prePhase3, postPhase3]);
    // phaser.setPhase([duration4, update4, prePhase4, postPhase4]);
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const {sketch, draw} = createDotDrawBucket(context);

    return {
        preDraw: () => {
            sketch.x = canvas.width / 2;
            sketch.y = canvas.height / 2;

            console.log('preDraw trigger');
        },
        postDraw: () => {
            console.log('postDraw trigger');
        },
        removeDraw: false,
        draw,
        sketch,
    };
};

const target = {
    one: {
        radius: 20,
    },
    two: {
        strokeAlpha: 0,
    },
    three: {
        strokeAlpha: 1,
    },
    four: {
        radius: 0,
    },
};

const createDotPhase1 = (sketch: DotSketch) => ({
    duration1: 2000,
    update1: (evt: EngineUpdateEvent) => {
        sketch.radius = target.one.radius * evt.phasePercentage;
    },
    prePhase1: () => {
        // No fill, just stroke, this could also be set in preDraw, not sure which spot is better
        sketch.lineWidth = 4;
        sketch.radius = 0;
        sketch.stroke.a = 1;

        console.log('prePhase-1 trigger');
    },
    postPhase1: () => {
        sketch.radius = target.one.radius;

        console.log('postPhase-1 trigger');
    },
});

const createDotPhase2 = (sketch: DotSketch) => ({
    duration2: 1000,
    update2: (evt: EngineUpdateEvent) => {
        sketch.stroke.a = evt.phasePercentageReverse;
    },
    prePhase2: () => {
        console.log('prePhase-2 trigger');
    },
    postPhase2: () => {
        sketch.stroke.a = 0;

        console.log('postPhase-2 trigger');
    },
});

const createDotPhase3 = (sketch: DotSketch) => ({
    duration3: 500,
    update3: (evt: EngineUpdateEvent) => {
        sketch.stroke.a = evt.phasePercentage;
    },
    prePhase3: () => {
        console.log('prePhase-3 trigger');
    },
    postPhase3: () => {
        sketch.stroke.a = 1;

        console.log('postPhase-3 trigger');
    },
});

const createDotPhase4 = (sketch: DotSketch) => ({
    duration4: 10000,
    update4: (evt: EngineUpdateEvent) => {
        sketch.radius = target.one.radius * evt.phasePercentageReverse;
    },
    prePhase4: () => {
        console.log('prePhase-2 trigger');
    },
    postPhase4: () => {
        sketch.radius = 0;

        console.log('postPhase-2 trigger');
    },
});

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

                ctx.beginPath();
                ctx.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
                ctx.stroke();
            },
        },
        sketch: Object.assign(sketch, {fill, stroke}),
    };
};

export type DotSketch = typeof dotSketch;

const dotSketch = {
    x: 0,
    y: 0,
    radius: 20,
    lineWidth: 1,
    stroke: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
    fill: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
};
