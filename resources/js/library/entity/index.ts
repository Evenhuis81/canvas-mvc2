import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getMouseHandlers} from './properties';
import type {Resources} from 'library/types';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityConfig> = {}) => create(options, resources),
});

const create = (options: Partial<EntityConfig>, {context, engine, input}: Resources) => {
    // Seperate the entity properties from the internal properties
    const {mouse, id, name, disabled, show, ...sketch} = {
        ...getProperties(defaultSketchProperties, options),
        id: options.id ?? `entity-${uid()}`,
    };

    // expand into multiple handlers
    const handlers = getMouseHandlers(mouse);

    const listeners = createListeners(sketch, handlers, input);

    const internalEntity = {
        properties: {
            id,
            name,
            disabled,
            show,
        },
        sketch,
        handlers,
        listeners,
        engine,
        context,
        input,
    };

    // Combine?
    const hoverTransition = createHoverTransition(internalEntity);
    const hoverUpdate = createTransitionUpdate(internalEntity, hoverTransition);

    engine.setUpdate(hoverUpdate);

    // create type and set dynamically, hover transition requires seperate update
    // possible combinations for hover- and animate-update
    const update = updates.noise(internalEntity);

    const draw = createDraw(internalEntity);

    const events = createEntityEvents(internalEntity, draw, update);

    initialize(internalEntity, events);

    return events;
};

const createHoverTransition = (properties: InternalEntity) => {
    const forward = () => {};
    const reverse = () => {};

    return {forward, reverse};
};

const createTransitionUpdate = (
    {properties: {id, name}, input: {mouse}, sketch}: InternalEntity,
    transition: TransitionBase,
) => ({
    id,
    name: `entity-hover-update${name}`,
    fn: () => {
        if (mouse.insideRect(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    },
});

const initialize = ({properties}: InternalEntity, events: EntityEvents) => {
    if (!properties.disabled) {
        properties.disabled = true;

        events.enable();
    }

    if (properties.show) {
        properties.show = false;

        events.show();
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

const updates = {
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
        sketch.x += updateProperties.adj;

        updateProperties.count++;

        if (updateProperties.count > 60) {
            updateProperties.adj *= -1;

            updateProperties.count = 0;
        }
    },
});

const createDraw = ({properties: {id, name}, sketch, context: ctx}: InternalEntity) => ({
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
    // Internal Properties
    disabled: false,
    show: true,
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
