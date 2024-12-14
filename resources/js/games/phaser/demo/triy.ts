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
    };

    let phaseTime = 2000;
    let timeAcc = 0.001;
    let perc = 0;

    const x2O = canvas.width + xHalf;
    const y1O = -xHalf;
    const x4O = -xHalf;
    const y3O = -xHalf;
    const x5O = 0;
    const x6O = canvas.width;
    const y5O = canvas.height;
    const y6O = canvas.height;
    const xDist1 = -canvas.width + radius / 2;
    const yDist1 = yHalf + xHalf - radius;
    const xDist2 = canvas.width - radius / 2;
    const yDist2 = yHalf + xHalf - radius;
    const xDist3 = xHalf - radius / 2; // (x2 -> left +, right -)
    const yDist3 = yHalf;

    const update1 = (evt: UpdateEvent) => {
        timeAcc += evt.timePassed;
        perc = timeAcc / phaseTime;

        t.x2 = x2O + perc * xDist1;
        t.y1 = y1O + perc * yDist1;

        t.x4 = x4O + perc * xDist2;
        t.y3 = y3O + perc * yDist2;

        // Incosistent (distance not set for left or right / up or down -> comment xDist3)
        t.x5 = x5O + perc * xDist3;
        t.x6 = x6O - perc * xDist3;
        t.y5 = y5O - perc * yDist3;
        t.y6 = y6O - perc * yDist3;
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
    x6: 0,
    y6: 0,
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
