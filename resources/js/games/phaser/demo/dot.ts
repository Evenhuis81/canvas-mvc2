import {resources} from 'library/index';
import {createPhaser} from '../phaser';
import {createTriyPhasesDemo} from './triy';

export const startDotDemoPhaser = (libraryID: string | number) => {
    const {context: ctx, canvas} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const removeDraw = false;
    const {draw, preDraw, postDraw} = createDotPhaserDraw(canvas, ctx);
    // [duration, update fn, prepare fn?, postpare fn?]
    const {duration, update, prePhase, postPhase} = createDotPhase1();

    phaser.setDraw([draw, preDraw, postDraw, removeDraw]);
    phaser.setPhase([duration, update, prePhase, postPhase]);

    phaser.start();
};

const createDotPhaserDraw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => ({
    draw: {fn: () => {}},
    preDraw: () => {},
    postDraw: () => {},
});

const createDotPhase1 = () => ({
    duration: 2000,
    update: () => {},
    prePhase: () => {},
    postPhase: () => {},
});
