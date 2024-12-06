import {resources} from 'library/index';
import {createPhaser} from './phaser';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const draw = createDraw(ctx, sketch);

    const phase1 = {
        type: 'draw',
        name: '',
        timeStart: 0,
        fn: () => {},
    };

    // phaser.setPhase(phase1);

    // TODO::Use library statistics
    // const drawStats = createDrawStats(ctx, engine, phaser, canvas.width / 2, canvas.height);

    const start = () => {
        // engine.setDraw(draw);
        // engine.setDraw(drawStats);
        // resources.hello.engine.setUpdate(update);
        // phaser.start();
    };

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;

    return {start};
};

const createDraw = (ctx: CanvasRenderingContext2D, sketch: CircySketch) => {
    // id: 'demo-circy',
    // name: 'Circy Demo Draw',
    // fn: () => {

    ctx.beginPath();

    ctx.fillStyle = sketch.fillStyle;
    ctx.strokeStyle = sketch.strokeStyle;
    ctx.lineWidth = sketch.lineWidth;

    ctx.arc(sketch.x, sketch.y, sketch.radius, sketch.startAngle, sketch.endAngle, sketch.counterclockwise);
    ctx.fill();
    ctx.stroke();
};

type CircySketch = {
    x: number;
    y: number;
    lineWidth: number;
    fillStyle: string;
    strokeStyle: string;
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: boolean;
};

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
