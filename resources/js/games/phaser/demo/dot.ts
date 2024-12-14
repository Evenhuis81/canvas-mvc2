import {resources} from 'library/index';
import {createPhaser} from '../phaser';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context: ctx, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    phaser.statsOn();

    const {draw, preDraw, postDraw, removeDraw} = createDotPhaserDraw(canvas, ctx);
    // [duration, update fn, prepare fn?, postpare fn?]
    const {duration, update, prePhase, postPhase} = createDotPhase1();

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);
    phaser.setPhase([duration, update, prePhase, postPhase]);

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => ({
    draw: {
        fn: () => {
            console.log('drawPhase running');
        },
    },
    preDraw: () => {
        console.log('preDraw trigger');
    },
    postDraw: () => {
        console.log('postDraw trigger');
    },
    removeDraw: true,
});

const createDotPhase1 = () => ({
    duration: 2000,
    update: () => {
        console.log('prePhase trigger');
    },
    prePhase: () => {
        console.log('prePhase trigger');
    },
    postPhase: () => {
        console.log('postPhase trigger');
    },
});
