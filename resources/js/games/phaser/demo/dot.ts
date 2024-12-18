import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);
    const {draw, preDraw, postDraw, removeDraw} = createDotPhaserDraw(canvas, context);

    const {draw: dotDraw, sketch} = draw;

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;

    const {duration, update, prePhase, postPhase} = createDotPhase1(sketch);

    phaser.setDraw([dotDraw, preDraw, postDraw, removeDraw]);
    phaser.setPhase([duration, update, prePhase, postPhase]);

    phaser.start();
};
const createDotPhaserDraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => ({
    draw: dotDraw(canvas, ctx),
    preDraw: () => {
        console.log('preDraw trigger');
    },
    postDraw: () => {
        console.log('postDraw trigger');
    },
    removeDraw: true,
});

const createDotPhase1 = (sketch: DotSketch) => ({
    duration: 2000,
    update: (evt: EngineUpdateEvent) => {
        // console.log('prePhase trigger');
    },
    prePhase: () => {
        // console.log('prePhase trigger');
    },
    postPhase: () => {
        // console.log('postPhase trigger');
    },
});

export type DotSketch = typeof dotSketch;

const dotDraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const sketch = {...dotSketch};
    const fill = {...dotSketch.fill};
    const stroke = {...dotSketch.stroke};

    return {
        draw: {
            id: 'dot-draw',
            name: 'Dot Draw Sketch',
            fn: () => {
                ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

                ctx.beginPath();
                ctx.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
                ctx.fill();
            },
        },
        sketch: Object.assign(sketch, {fill, stroke}),
    };
};

const dotSketch = {
    x: 0,
    y: 0,
    radius: 0,
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
