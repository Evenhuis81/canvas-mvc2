import {resources} from 'library/index';
import {createDrawStats, createDraw} from './draw';
import {createPhaser} from './phaser';

export const getCircy = () => {
    const {context: ctx, canvas, engine} = resources.hello;

    const phaser = createPhaser(engine);
    // const update = createUpdate(engine, phaser);
    const draw = createDraw(ctx, sketch);
    const drawStats = createDrawStats(ctx, engine, phaser, canvas.width / 2, canvas.height);

    const start = () => {
        resources.hello.engine.setDraw(draw);
        resources.hello.engine.setDraw(drawStats);

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
