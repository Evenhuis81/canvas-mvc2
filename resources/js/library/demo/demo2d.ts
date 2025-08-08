import type {Engine, UpdateOrDraw} from '../types/engine';

export const createDemo2D = (context: CanvasRenderingContext2D, engine: Engine) => {
    const demoUpdate = createDemoUpdate();
    const demoDraw = createDemoDraw(context, {...demoObject});
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

const createDemoUpdate = (): Omit<UpdateOrDraw<'update'>, 'type'> => ({
    id: 'lib-2d-demo-update',
    name: 'Library 2D Demo Update',
    fn: () => {
        demoObject.x++;

        console.log('demo 2d update runing');

        // Use Phaser here for different updates in different phases
    },
});
const createDemoDraw = (
    ctx: CanvasRenderingContext2D,
    dObj: typeof demoObject,
): Omit<UpdateOrDraw<'draw'>, 'type'> => ({
    id: 'lib-2d-demo-draw',
    name: 'Library 2D Demo Draw',
    fn: createPhase1(ctx, ctx.canvas, dObj),
});

const startSize = 5;

const demoObject = {
    x: 200,
    y: 150,
    r: 5,
    stroke: '#f00',
    fill: '#00f',
    lineWidth: startSize / 5,
};

const createPhase1 =
    (ctx: CanvasRenderingContext2D, {width, height}: HTMLCanvasElement, dObj: typeof demoObject) =>
    () => {
        ctx.fillStyle = dObj.fill;

        ctx.beginPath();

        ctx.arc(width / 2, height / 2, dObj.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    };
