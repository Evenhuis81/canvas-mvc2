const animationUpdates = {
    noise: (props: InternalEntity) => createNoiseUpdate(props),
    // bold: (props: InternalEntity, transition: Transition) => createBoldUpdate(sketch, hoverTransition, input, id, name),
};

// const createBoldUpdate = (sketch: EntitySketch, transition: Transition, input: Input, id: string | number, name: string) => ({
//     id: id,
//     name: `bold-update-${name}`,
//     fn: () => {
//         if (mouse.insideRect(sketch) && !mouse.touchEnded) {
//             transition.forward();

//             return;
//         }

//         transition.reverse();
//     }
// })

const createNoiseUpdate = ({properties: {id, name}, sketch}: InternalEntity) => ({
    id: id,
    name: `noise-animation-update-${name}`,
    fn: () => {
        sketch.x += upd.adj;

        upd.count++;

        if (upd.count > 60) {
            upd.adj *= -1;

            upd.count = 0;
        }
    },
});

export const createDraw = ({properties: {id, name}, sketch, context: ctx}: InternalEntity) => ({
    id,
    name: `draw-${name}`,
    fn: () => {
        ctx.fillStyle = sketch.fill;
        ctx.strokeStyle = sketch.stroke;
        ctx.lineWidth = sketch.lw;

        ctx.beginPath();
        ctx.roundRect(sketch.x - sketch.w / 2, sketch.y - sketch.h / 2, sketch.w, sketch.h, sketch.r);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = sketch.textFill;
        ctx.font = `${sketch.fontSize}px ${sketch.font}`;

        ctx.textAlign = sketch.textAlign;
        ctx.textBaseline = sketch.textBaseLine;

        ctx.beginPath();
        ctx.fillText(sketch.text, sketch.x, sketch.y + 1.5);
    },
});

// max property is default 60, need for deltaTime, adj is change in property
// make this a createProperties that picks the needed properties for each update respectively
// This could also serve as a originalProperties object
const upd = {
    origin: {
        lw: 0,
    },
    range: {
        lw: 1,
    },
    vel: {
        x: 0,
        y: 0,
    },
    adj: 0.05,
    lw: 0,
    count: 0,
    max: 60,
    angle: 0,
};
