import {DrawPhase, UpdatePhases} from '../types';

export const createTriyPhases = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Lerp on updates?
    const xHalf = canvas.width / 2;
    const yHalf = canvas.height / 2;
    const radius = 25;

    const t = triySketch;

    const preDraw = () => {
        t.strokeStyle1.a = 1;
        t.strokeStyle2.a = 1;
        t.strokeStyle3.a = 1;
        t.x1 = xHalf;
        t.y1 = -xHalf;
        t.x2 = canvas.width + xHalf;
        t.y2 = yHalf;
        t.x3 = xHalf;
        t.y3 = -xHalf;
        t.x4 = -xHalf;
        t.y4 = yHalf;
        t.x5 = 0;
        t.y5 = canvas.height;
        t.x6 = canvas.width;
        t.y6 = canvas.height;
    };

    const postDraw = () => {
        console.log('postDraw phase 1');
    };

    const prePhase1 = () => {
        console.log('prephase 1');
    };
    const postPhase1 = () => {
        console.log('postphase 1');
        console.log(t.x4, t.y4); // 3rd stroke left @ end phase
        console.log(t.x2, t.y2); // right side
    };

    let phaseTime = 2000;
    let timeAcc = 0.01;
    const x2O = canvas.width + xHalf;
    const y1O = -xHalf;
    const x4O = -xHalf;
    const y3O = -xHalf;
    const x5O =
    const xDist1 = -canvas.width + radius /2;
    const yDist1 = yHalf + xHalf - radius;
    const xDist2 = canvas.width - radius /2;
    const yDist2 = yHalf + xHalf - radius;

    const update1 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;

        t.x2 = x2O + (timeAcc / phaseTime) * xDist1;
        t.y1 = y1O + (timeAcc / phaseTime) * yDist1;

        t.x4 = x4O + (timeAcc / phaseTime) * xDist2;
        t.y3 = y3O + (timeAcc / phaseTime) * yDist2;
    };

    const removeDraw = false;

    // const drawTriy = createDrawTriy(ctx);
    const drawTriy = createDrawStroke1LargeToThin(ctx);

    const phaseDraw: DrawPhase = [drawTriy, preDraw, postDraw, removeDraw];

    const updatePhases: UpdatePhases = [[phaseTime, update1, prePhase1, postPhase1]];

    return {phaseDraw, updatePhases};
};

const createDrawStroke1LargeToThin = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-triy-line1',
    name: 'Line 1 Triy Demo Draw',
    fn: () => {
        ctx.strokeStyle = `rgba(${triySketch.strokeStyle1.r}, ${triySketch.strokeStyle1.g}, ${triySketch.strokeStyle1.b}, ${triySketch.strokeStyle1.a})`;
        ctx.lineWidth = triySketch.lineWidth;

        ctx.beginPath();
        ctx.moveTo(triySketch.x1, triySketch.y1);
        ctx.lineTo(triySketch.x2, triySketch.y2);
        ctx.stroke();

        ctx.moveTo(triySketch.x3, triySketch.y3);
        ctx.lineTo(triySketch.x4, triySketch.y4);
        ctx.stroke();

        ctx.moveTo(triySketch.x5, triySketch.y5);
        ctx.lineTo(triySketch.x6, triySketch.y6);
        ctx.stroke();
    },
});

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

// const targetPositions = (t: typeof triySketch) => {
//     t.x1 = xHalf;
//     t.y1 = yHalf - radius;
//     t.x2 = xHalf + radius;
//     t.y2 = yHalf + radius;
//     t.x3 = xHalf - radius;
//     t.y3 = yHalf + radius;
// }

export const triySketch = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0,
    x5: 0,
    y5: 0,
    y6: 0,
    x6: 0,
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
