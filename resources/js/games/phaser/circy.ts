import {resources} from 'library/index';
import {createDrawStats, createDraw} from './draw';
import {createPhaser} from './phaser';

export const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    const draw = createDraw(ctx, sketch);

    // const phase1draw = () => {
    //     ctx.beginPath();

    //     ctx.fillStyle = 'red';
    //     ctx.fillRect(100, 100, 80, 40);

    //     console.log('test phase1draw');
    // }

    const phase1 = ['draw', 'phase1draw', 2000, draw];

    phaser.setPhase(phase1);

    // TODO::Use library statistics
    // const drawStats = createDrawStats(ctx, engine, phaser, canvas.width / 2, canvas.height);

    const start = () => {
        // engine.setDraw(draw);
        // engine.setDraw(drawStats);

        // resources.hello.engine.setUpdate(update);

        phaser.start();
    };

    sketch.x = canvas.width / 2;
    sketch.y = canvas.height / 2;

    return {start};
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
