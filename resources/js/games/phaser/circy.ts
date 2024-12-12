import {resources} from 'library/index';
import {createPhaser} from './phaser';
import statistics from 'library/statistics';
import type {DrawPhase, UpdatePhases} from './types';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    // const drawCircy = createDrawCircy(ctx);
    // const phases = createCircyPhases(canvas, drawCircy);

    const {phaseDraw, updatePhases} = createTriyPhases(canvas, ctx);

    phaser.setDraw(phaseDraw);
    phaser.setUpdates(updatePhases);

    const run = () => {
        statistics.run(libraryID);

        phaser.start();
    };

    // Move this to phaser
    statistics.create(libraryID);
    statistics.setFn(libraryID, () => `Engine draws: ${engine.info.draws.length()}`);
    statistics.setFn(libraryID, () => `Engine updates: ${engine.info.updates.length()}`);
    statistics.setFn(libraryID, () => `Engine draw IDs: ${engine.info.draws.ids()}`);
    statistics.setFn(libraryID, () => `Engine update IDs: ${engine.info.updates.ids()}`);

    return {run};
};

const createDrawTriy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-triy',
    name: 'Triy Demo Draw',
    fn: () => {
        ctx.strokeStyle = `rgba(${triySketch.strokeStyle1.r}, ${triySketch.strokeStyle1.g}, ${triySketch.strokeStyle1.b}, ${triySketch.strokeStyle1.a})`;
        // ctx.strokeStyle = `rgba(${triySketch.strokeStyle2.r}, ${triySketch.strokeStyle2.g}, ${triySketch.strokeStyle2.b}, ${triySketch.strokeStyle2.a})`;
        // ctx.strokeStyle = `rgba(${triySketch.strokeStyle3.r}, ${triySketch.strokeStyle3.g}, ${triySketch.strokeStyle3.b}, ${triySketch.strokeStyle3.a})`;

        ctx.beginPath();
        ctx.moveTo(triySketch.x1, triySketch.y1);
        ctx.lineTo(triySketch.x2, triySketch.y2);
        ctx.lineTo(triySketch.x3, triySketch.y3);
        ctx.closePath();
        ctx.lineWidth = triySketch.lineWidth;
        ctx.stroke();
    },
});

const triySketch = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    lineWidth: 2,
    strokeStyle1: {
        r: 255,
        g: 255,
        b: 255,
        a: 0,
    },
    strokeStyle2: {
        r: 255,
        g: 255,
        b: 255,
        a: 0,
    },
    strokeStyle3: {
        r: 255,
        g: 255,
        b: 255,
        a: 0,
    },
    fillStyle: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
};

const createDrawCircy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-circy',
    name: 'Circy Demo Draw',
    fn: () => {
        ctx.lineWidth = circySketch.lineWidth;
        ctx.fillStyle = `rgba(${circySketch.fillStyle.r}, ${circySketch.fillStyle.g}, ${circySketch.fillStyle.b}, ${circySketch.fillStyle.a})`;
        ctx.strokeStyle = `rgba(${circySketch.strokeStyle.r}, ${circySketch.strokeStyle.g}, ${circySketch.strokeStyle.b}, ${circySketch.strokeStyle.a})`;

        ctx.beginPath();

        ctx.arc(
            circySketch.x,
            circySketch.y,
            circySketch.radius,
            circySketch.startAngle,
            circySketch.endAngle,
            circySketch.counterclockwise,
        );
        ctx.fill();
        ctx.stroke();
    },
});

const circySketch = {
    x: 0,
    y: 0,
    lineWidth: 2,
    fillStyle: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    strokeStyle: {
        r: 255,
        g: 255,
        b: 255,
        a: 0,
    },
    radius: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
};

const createTriyPhases = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Start using Lerp on updates?

    const xHalf = canvas.width / 2;
    const yHalf = canvas.height / 2;
    const radius = 25;

    const t = triySketch;

    const preDraw = () => {
        t.x1 = xHalf;
        t.y1 = yHalf - radius;
        t.x2 = xHalf + radius;
        t.y2 = yHalf + radius;
        t.x3 = xHalf - radius;
        t.y3 = yHalf + radius;
        t.strokeStyle1.a = 1;
        t.strokeStyle2.a = 1;
        t.strokeStyle3.a = 1;
    };

    // const postDraw = () => {};
    const update1 = () => {
        console.log('update 1 running');
    };

    const removeDraw = true;

    const drawTriy = createDrawTriy(ctx);

    const phaseDraw: DrawPhase = [drawTriy, preDraw, undefined, removeDraw];

    const updatePhases: UpdatePhases = [[1000, update1, undefined, undefined]];

    return {phaseDraw, updatePhases};
};

const createCircyPhases = (canvas: HTMLCanvasElement, drawCircy: Draw) => {
    const prepareDraw = () => {
        circySketch.x = canvas.width / 2;
        circySketch.y = canvas.height / 2;
        circySketch.lineWidth = 4;
        circySketch.radius = 25;
    };

    const postpareDraw = () => {};

    let timeAcc = 0.1;
    let phaseTime = 5000;

    const postUpdate1 = () => {
        circySketch.strokeStyle.a = 1;
        phaseTime = 3000;
        timeAcc = 0;
    };

    const update1 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.strokeStyle.a = timeAcc / phaseTime;
    };

    const postUpdate2 = () => {
        circySketch.fillStyle.r = 255;
        timeAcc = 0;
        phaseTime = 10000;
    };

    const update2 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.fillStyle.r = 255 * (timeAcc / phaseTime);
    };

    const xOrig = canvas.width / 2;
    const xMove = -200;

    const postUpdate3 = () => {
        circySketch.x = xOrig + xMove;
    };

    const update3 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.x = xOrig + (timeAcc / phaseTime) * xMove;
    };

    const testPrepareUpdate = () => {};

    const removeDraw = true;

    const phases = [
        drawCircy,
        prepareDraw,
        postpareDraw,
        removeDraw,
        [5000, update1, undefined, postUpdate1],
        [3000, update2, testPrepareUpdate, postUpdate2],
        [10000, update3, undefined, postUpdate3],
    ];

    return phases;
};
