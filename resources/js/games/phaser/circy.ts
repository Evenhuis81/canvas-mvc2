import {resources} from 'library/index';
import {createPhaser} from './phaser';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    // const phaser = createPhaser(libraryID);

    const drawCircy = createDrawCircy(ctx);

    const run = () => {
        engine.setDraw(drawCircy);
        // engine.setDraw(drawStats);
        // resources.hello.engine.setUpdate(update);

        // phaser.start();
    };

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;
    sketch.lineWidth = 2;
    sketch.radius = 20;

    return {run};
};

const createDrawCircy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-circy',
    name: 'Circy Demo Draw',
    fn: () => {
        ctx.beginPath();

        ctx.fillStyle = `rbba(${sketch.fillStyle.r}, ${sketch.fillStyle.g}, ${sketch.fillStyle.b}, ${sketch.fillStyle.a})`;
        ctx.strokeStyle = `rbba(${sketch.strokeStyle.r}, ${sketch.strokeStyle.g}, ${sketch.strokeStyle.b}, ${sketch.strokeStyle.a})`;
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
        a: 0,
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
