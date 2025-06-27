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
        // demoObject.x++;
        // Use Phaser here for different updates in different phases
    },
});
const createDemoDraw = (
    ctx: CanvasRenderingContext2D,
    dObj: typeof demoObject,
): Omit<UpdateOrDraw<'draw'>, 'type'> => ({
    id: 'lib-2d-demo-draw',
    name: 'Library 2D Demo Draw',
    fn: () => {
        ctx.fillStyle = dObj.fill;
        ctx.strokeStyle = dObj.stroke;
        ctx.lineWidth = dObj.lineWidth;

        ctx.beginPath();

        ctx.arc(dObj.x, dObj.y, dObj.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },
});

const demoObject = {
    x: 200,
    y: 150,
    r: 20,
    stroke: '#f00',
    fill: '#00f',
    lineWidth: 1,
};
