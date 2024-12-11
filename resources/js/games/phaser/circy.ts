import {resources} from 'library/index';
import {PhaseConfig, createPhaser} from './phaser';
import statistics from 'library/statistics';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const drawCircy = createDrawCircy(ctx);

    const phaser = createPhaser(libraryID);

    const phases = createPhases(canvas, drawCircy);

    phaser.set(phases);

    const run = () => {
        // engine.setDraw(drawCircy);
        // engine.setUpdate({id: 'upd1', fn: update1});
        statistics.run(libraryID);

        phaser.start();
    };

    // Move this to phaser
    statistics.create(libraryID, canvas, ctx, engine);
    statistics.setFn(libraryID, () => `${sketch.strokeStyle.a.toFixed(2)}`);

    return {run};
};

const createDrawCircy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-circy',
    name: 'Circy Demo Draw',
    fn: () => {
        ctx.beginPath();

        ctx.fillStyle = `rgba(${sketch.fillStyle.r}, ${sketch.fillStyle.g}, ${sketch.fillStyle.b}, ${sketch.fillStyle.a})`;
        ctx.strokeStyle = `rgba(${sketch.strokeStyle.r}, ${sketch.strokeStyle.g}, ${sketch.strokeStyle.b}, ${sketch.strokeStyle.a})`;
        ctx.lineWidth = sketch.lineWidth;

        ctx.arc(sketch.x, sketch.y, sketch.radius, sketch.startAngle, sketch.endAngle, sketch.counterclockwise);
        ctx.fill();
        ctx.stroke();
    },
});

const sketch = {
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

const createPhases = (canvas: HTMLCanvasElement, drawCircy: Draw) => {
    // Start using Lerp on updates?
    const prepareDraw = () => {
        sketch.x = canvas.width / 2;
        sketch.y = canvas.height / 2;
        sketch.lineWidth = 4;
        sketch.radius = 25;

        console.log('triggered prepare draw');
    };

    const postpareDraw = () => {
        console.log('triggered postpare draw');
    };

    let timeAcc = 0.1;
    let phaseTime = 5000;

    const postUpdate1 = () => {
        sketch.strokeStyle.a = 1;
        phaseTime = 3000;
        timeAcc = 0;

        console.log('triggered postUpdate1');
    };

    const update1 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        sketch.strokeStyle.a = timeAcc / phaseTime;
    };

    const postUpdate2 = () => {
        sketch.fillStyle.r = 255;
        timeAcc = 0;
        phaseTime = 10000;

        console.log('triggered postUpdate2');
    };

    const update2 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        sketch.fillStyle.r = 255 * (timeAcc / phaseTime);
    };

    const xOrig = canvas.width / 2;
    const xMove = -200;

    const postUpdate3 = () => {
        sketch.x = xOrig + xMove;

        console.log('triggered postUpdate3');
    };

    const update3 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        sketch.x = xOrig + (timeAcc / phaseTime) * xMove;
    };

    const testPrepareUpdate = () => {
        console.log('triggered prepareUpdate');
    };

    const phases: PhaseConfig = [
        drawCircy,
        prepareDraw,
        postpareDraw,
        [5000, update1, undefined, postUpdate1],
        [3000, update2, testPrepareUpdate, postUpdate2],
        [10000, update3, undefined, postUpdate3],
    ];

    return phases;
};
