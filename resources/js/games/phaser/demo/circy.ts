import {EngineDraw, EngineUpdateEvent} from 'library/types/engine';

export const createDrawCircy = (ctx: CanvasRenderingContext2D) => ({
    id: 'demo-circy',
    name: 'Circy Demo Draw',
    fn: () => {
        ctx.lineWidth = circySketch.lineWidth;
        ctx.fillStyle = `rgba(${circySketch.fillStyle.r}, ${circySketch.fillStyle.g}, ${circySketch.fillStyle.b}, ${circySketch.fillStyle.a})`;
        ctx.strokeStyle = `rgba(${circySketch.strokeStyle.r}, ${circySketch.strokeStyle.g}, ${circySketch.strokeStyle.b}, ${circySketch.strokeStyle.a})`;

        ctx.beginPath();

        ctx.arc(
            circySketch.x,
            circySketch.y,
            circySketch.radius,
            circySketch.startAngle,
            circySketch.endAngle,
            circySketch.counterclockwise,
        );
        ctx.fill();
        ctx.stroke();
    },
});

export const createCircyPhases = (canvas: HTMLCanvasElement, drawCircy: EngineDraw) => {
    const prepareDraw = () => {
        circySketch.x = canvas.width / 2;
        circySketch.y = canvas.height / 2;
        circySketch.lineWidth = 4;
        circySketch.radius = 25;
    };

    const postpareDraw = () => {};

    let timeAcc = 0.01;
    let phaseTime = 5000;

    const postUpdate1 = () => {
        circySketch.strokeStyle.a = 1;
        phaseTime = 3000;
        timeAcc = 0;
    };

    const update1 = (evt: EngineUpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.strokeStyle.a = timeAcc / phaseTime;
    };

    const postUpdate2 = () => {
        circySketch.fillStyle.r = 255;
        timeAcc = 0;
        phaseTime = 10000;
    };

    const update2 = (evt: EngineUpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.fillStyle.r = 255 * (timeAcc / phaseTime);
    };

    const xOrig = canvas.width / 2;
    const xMove = -200;

    const postUpdate3 = () => {
        circySketch.x = xOrig + xMove;
    };

    const update3 = (evt: EngineUpdateEvent) => {
        timeAcc += evt.timePassed;

        circySketch.x = xOrig + (timeAcc / phaseTime) * xMove;
    };

    const testPrepareUpdate = () => {};

    const removeDraw = true;

    const phases = [
        drawCircy,
        prepareDraw,
        postpareDraw,
        removeDraw,
        [5000, update1, undefined, postUpdate1],
        [3000, update2, testPrepareUpdate, postUpdate2],
        [10000, update3, undefined, postUpdate3],
    ];

    return phases;
};

export type CircySketch = typeof circySketch;

export const circySketch = {
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
