import {resources} from 'library/index';
// import {createPhaser} from './phaser';
import statistics from 'library/statistics';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    // const phaser = createPhaser(libraryID);

    const drawCircy = createDrawCircy(ctx);

    const run = () => {
        engine.setDraw(drawCircy);
        engine.setUpdate({id: 'upd1', fn: update1});

        statistics.run(libraryID);
        // engine.setDraw(drawStats);
        // resources.hello.engine.setUpdate(update);

        // phaser.start();
    };

    let timeAcc = 0.1;
    let phaseTime = 5000;

    statistics.create(libraryID, canvas, ctx, engine);
    statistics.setFn(libraryID, () => `${sketch.strokeStyle.a.toFixed(2)}`);

    const update1 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        if (timeAcc > phaseTime) {
            sketch.strokeStyle.a = 1;

            timeAcc = 0;
            phaseTime = 3000;

            engine.removeUpdate('upd1');

            engine.setUpdate({id: 'upd2', fn: update2});

            return console.log(`phase1 ended (>${phaseTime}>`);
        }

        sketch.strokeStyle.a = timeAcc / phaseTime;
    };

    const update2 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        if (timeAcc > phaseTime) {
            sketch.fillStyle.r = 255;

            timeAcc = 0;
            phaseTime = 10000;

            engine.removeUpdate('upd2');

            engine.setUpdate({id: 'upd3', fn: update3});

            return console.log(`phase2 ended (>${phaseTime}>`);
        }

        sketch.fillStyle.r = 255 * (timeAcc / phaseTime);
    };

    const xOrig = canvas.width / 2;
    const xMove = -200;

    const update3 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        if (timeAcc > phaseTime) {
            sketch.x = xOrig + xMove;

            timeAcc = 0;
            phaseTime = 10000;

            engine.removeUpdate('upd3');
            // engine.setUpdate({id: 'upd3', fn: update3});

            return console.log(`phase3 ended (>${phaseTime}>`);
        }

        sketch.x = xOrig + (timeAcc / phaseTime) * xMove;
    };

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;
    sketch.lineWidth = 4;
    sketch.radius = 25;

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
