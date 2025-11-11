import type {Engine, UpdateOrDraw} from '../types/engine';

export const createDemo2D = (context: CanvasRenderingContext2D, engine: Engine) => {
    const dObj = {...demoObject};
    dObj.x = context.canvas.width / 2;
    dObj.y = context.canvas.height / 2;

    const demoUpdate = createDemoUpdate(dObj, context);
    const demoDraw = createDemoDraw(context, dObj);
    let demo2dRunning = false;

    return {
        start: () => {
            if (demo2dRunning) {
                console.log('2d demo is already running');

                return;
            }

            engine.set('update', demoUpdate);
            engine.set('draw', demoDraw);

            engine.run();

            demo2dRunning = true;
        },
        stop: () => {
            if (!demo2dRunning) {
                console.log('2d demo is not running');

                return;
            }

            demo2dRunning = false;

            engine.unset(demoDraw.id);
            engine.unset(demoUpdate.id);

            engine.halt();
        },
    };
};

const createDemoUpdate = (
    dObj: typeof demoObject,
    ctx: CanvasRenderingContext2D,
): Omit<UpdateOrDraw<'update'>, 'type'> => ({
    id: 'lib-2d-demo-update',
    name: 'Library 2D Demo Update',
    fn: () => {
        ctx.fillStyle = dObj.fill;
        ctx.strokeStyle = dObj.stroke;
        ctx.lineWidth = dObj.r / dObj.lineFactor;

        dObj.r += dObj.rV;

        if (dObj.r > dObj.rMax || dObj.r < dObj.rMin) dObj.rV = -dObj.rV;

        // TODO::Phaser for different updates in different phases
    },
});

const createDemoDraw = (
    ctx: CanvasRenderingContext2D,
    dObj: typeof demoObject,
): Omit<UpdateOrDraw<'draw'>, 'type'> => ({
    id: 'lib-2d-demo-draw',
    name: 'Library 2D Demo Draw',
    fn: createPhase1(ctx, dObj),
});

const demoObject = {
    x: 200,
    y: 150,
    r: 0,
    stroke: '#80f',
    fill: '#00f',
    lineFactor: 5,
    rV: 0.1, // radius Velocity
    rMax: 25, // radius Maximum
    rMin: 0, // radius Minimum
};

const createPhase1 = (ctx: CanvasRenderingContext2D, dObj: typeof demoObject) => () => {
    ctx.beginPath();

    ctx.arc(dObj.x, dObj.y, dObj.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};
