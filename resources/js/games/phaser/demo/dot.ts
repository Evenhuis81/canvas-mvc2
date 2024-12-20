import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import type {EngineUpdateEvent} from 'library/types/engine';
import {PhaserProperties} from '../types';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const {draw, preDraw: preDrawTemp, postDraw, removeDraw} = createDotPhaserDraw(canvas, context);

    const {draw: dotDraw, sketch} = draw;

    const preDraw = () => preDrawTemp(sketch);

    const {duration1, update1, prePhase1, postPhase1} = createDotPhase1(canvas, sketch, phaser.props);
    const {duration2, update2, prePhase2, postPhase2} = createDotPhase2(sketch, phaser.props);

    phaser.setDraw([dotDraw, preDraw, postDraw, removeDraw]);
    phaser.setPhase([duration1, update1, prePhase1, postPhase1]);
    phaser.setPhase([duration2, update2, prePhase2, postPhase2]);

    phaser.start();
};
const createDotPhaserDraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => ({
    draw: getDotDraw(ctx),
    preDraw: (sketch: DotSketch) => {
        sketch.x = canvas.width / 2;
        sketch.y = canvas.height / 2;
    },
    postDraw: () => {
        console.log('postDraw trigger');
    },
    removeDraw: false,
});

const createDotPhase1 = (canvas: HTMLCanvasElement, sketch: DotSketch, props: PhaserProperties) => {
    const target = {
        radius: 20,
    };

    type PhaserUpdateEvent = {
        perc: number;
    };

    return {
        duration1: 2000,
        update1: (evt: PhaserUpdateEvent) => {
            sketch.radius = 20 * evt.perc;
        },
        prePhase1: () => {
            sketch.radius = 0;

            console.log('prePhase-1 trigger');
        },
        postPhase1: () => {
            sketch.radius = target.radius;

            console.log('postPhase-1 trigger');
        },
    };
};

const createDotPhase2 = (sketch: DotSketch, props: PhaserProperties) => ({
    duration2: 1000,
    update2: (evt: EngineUpdateEvent) => {
        console.log(props.perc);
        // sketch.radius = 200 - 200 * props.amount;
    },
    prePhase2: () => {
        console.log('prePhase trigger');
    },
    postPhase2: () => {
        sketch.radius = 0;
    },
});

export type DotSketch = typeof dotSketch;

const getDotDraw = (ctx: CanvasRenderingContext2D) => {
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
    radius: 20,
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
