import type {Engine, UpdateOrDraw} from './types/engine';

export const createDemo2D = (context: CanvasRenderingContext2D, engine: Engine) => {
    const demoUpdate = createDemoUpdate();
    const demoDraw = createDemoDraw(context);
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
    },
});

const createDemoDraw = (ctx: CanvasRenderingContext2D): Omit<UpdateOrDraw<'draw'>, 'type'> => ({
    id: 'lib-2d-demo-draw',
    name: 'Library 2D Demo Draw',
    fn: () => {
        const dob = {...demoObject};

        ctx.fillStyle = dob.fill;
        ctx.strokeStyle = dob.stroke;
        ctx.lineWidth = dob.lineWidth;

        ctx.beginPath();

        ctx.arc(dob.x, dob.y, dob.r, 0, Math.PI * 2);
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
