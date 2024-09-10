import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import type {Resources} from 'library/types';
import {getInternalEntity} from './properties';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityConfig> = {}) => create(options, resources),
});

const create = (options: Partial<EntityConfig>, {context, engine, input}: Resources) => {
    // First seperate the entity properties from the internal properties
    const {[click, id, name, disabled, show], ...sketch} = {
        ...getProperties(defaultSketchProperties, options),
        id: options.id ?? `entity-${uid()}`,
    };

    // const tempIntProps = {
    //     //
    // }

    const update = updates.noise(sketch, id, name);

    const draw = createDraw(sketch, context, id, name);

    // If more internal properties are added, refactor this
    const internalEntity = getInternalEntity(engine, draw, update, sketch, id, name, disabled, show, click);

    // Events

    // Initializer
    initialize(internalEntity);

    return internalEntity.events;
};

const initialize = (entity: InternalEntity) => {
    if (!entity.disabled) {
        entity.disabled = true;

        entity.events.enable();
    }

    if (entity.show) {
        entity.show = false;

        entity.events.show();
    }
};

// max property is default 60, need for deltaTime, adj is change in property
// make this a createProperties that picks the needed properties for each update respectively
// This could also serve as a originalProperties object
const updateProperties = {
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

// noise = just move left and right a little for now
const updates = {
    noise: (sketch: EntitySketch, id: string | number, name: string) => createNoiseUpdate(sketch, id, name),
    // bold: (sketch: EntitySketch, id: string | number, name: string, transition) => createBoldUpdate(sketch, hoverTransition, input, id, name),
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

const createNoiseUpdate = (sketch: EntitySketch, id: string | number, name: string) => ({
    id: id,
    name: `noise-update-${name}`,
    fn: () => {
        sketch.x += updateProperties.adj;

        updateProperties.count++;

        if (updateProperties.count > 60) {
            updateProperties.adj *= -1;

            updateProperties.count = 0;
        }
    },
});

const createDraw = (sketch: EntitySketch, ctx: CanvasRenderingContext2D, id: string | number, name: string) => ({
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

const defaultSketchProperties = {
    name: 'undefined',
    x: 200,
    y: 299,
    w: 150,
    h: 50,
    lw: 2,
    r: 5,
    stroke: '#f00',
    fill: '#000',
    textFill: '#fff',
    text: 'undefined',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
    // Next are part of internal properties, could make a seperate object for this if it gets large
    disabled: false,
    show: true,
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
