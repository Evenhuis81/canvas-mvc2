import {resources} from 'library/index';
import {createPhaser} from './phaser';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const drawCircy = createDrawCircy(ctx);

    console.log(drawCircy);

    const phase1 = {
        type: 'draw',
        // name: '',
        timeStart: 0,
        // duration: 3000,
        fn: () => {},
    };

    phaser.setPhase(phase1);

    const start = () => {
        engine.setDraw(drawCircy);
        // engine.setDraw(drawStats);
        // resources.hello.engine.setUpdate(update);

        // phaser.start();
    };

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;
    sketch.lineWidth = 2;
    sketch.radius = 50;

    return {start};
};

const createDrawCircy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-circy',
    name: 'Circy Demo Draw',
    fn: () => {
        ctx.beginPath();

        ctx.fillStyle = sketch.fillStyle;
        ctx.strokeStyle = sketch.strokeStyle;
        ctx.lineWidth = sketch.lineWidth;

        ctx.arc(sketch.x, sketch.y, sketch.radius, sketch.startAngle, sketch.endAngle, sketch.counterclockwise);
        ctx.fill();
        ctx.stroke();
    },
});

const sketch = {
    x: 0,
    y: 0,
    lineWidth: 0,
    fillStyle: '#000',
    strokeStyle: '#fff',
    radius: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
};
