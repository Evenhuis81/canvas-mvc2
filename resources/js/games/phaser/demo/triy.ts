import {DrawPhase, UpdatePhases} from '../types';

export const createDrawTriy = (ctx: CanvasRenderingContext2D) => ({
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

export const createTriyPhases = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Start using Lerp on updates!
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

    const postDraw = () => {
        console.log('postDraw phase 1');
    };

    const prePhase1 = () => {
        console.log('prephase 1');
    };
    const postPhase1 = () => {
        console.log('postphase 1');
    };

    const update1 = () => {
        console.log('update 1 running');
    };

    const removeDraw = false;

    const drawTriy = createDrawTriy(ctx);

    const phaseDraw: DrawPhase = [drawTriy, preDraw, postDraw, removeDraw];

    const updatePhases: UpdatePhases = [[1000, update1, prePhase1, postPhase1]];

    return {phaseDraw, updatePhases};
};

export const triySketch = {
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
