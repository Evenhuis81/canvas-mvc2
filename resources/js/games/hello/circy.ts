import {resources} from 'library/index';
import { createUpdate } from './update';
import { createDrawStats, createDraw } from './draw';

export const getCircy = () => {
    const {context: ctx, canvas, engine} = resources.hello;

    const update = createUpdate(engine);
    const draw = createDraw();
    const drawStats = createDrawStats();

    const start = () => {
        resources.hello.engine.setDraw(draw);
        resources.hello.engine.setDraw(drawStats);
        resources.hello.engine.setUpdate(update);
    };

    props.sketch.x = canvas.width / 2;
    props.sketch.y = canvas.height / 2;

    return {start};
};

const props = {
    sketch: {
        x: 0,
        y: 0,
        lineWidth: 0,
        fillStyle: '#000',
        strokeStyle: '#fff',
        radius: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
    },
    // Calculate time passed on each frame and total time for each phase and divide those for each update
    timer: {
        time: 0,
        lastTime: 0,
        timePassed: 0,
    },
    phaser: {
        number: 0,
        end: 4,
        shifts: [0],
    },
};

export type Phaser = {
    number: number;
    end: number;
    shifts: number[];
}

export type CircySketch = {
    x: number,
    y: number,
    lineWidth: number,
    fillStyle: string,
    strokeStyle: string,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise: boolean,
},
