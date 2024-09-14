import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getMouseHandlers} from './properties';
import type {Resources} from 'library/types';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityConfig> = {}) => create(options, resources),
});

const create = (options: Partial<EntityConfig>, {context, engine, input}: Resources) => {
    // Seperate the entity properties from the internal properties
    const {id, name, disabled, show, showDelay, ...sketch} = {
        ...getProperties(defaultSketchProperties, options),
        id: options.id ?? `entity-${uid()}`,
    };

    // startType: 'fadein',
    // endType: 'fadeout'
    // onStartEnd: () => {}
    // onEndEnd: () => {}

    const handlers = getHandlers(options);

    const listeners = createListeners(sketch, handlers, input);

    const internalEntity: InternalEntity = {
        properties: {
            id,
            name,
            disabled,
            show,
            showDelay,
        },
        sketch,
        handlers,
        listeners,
        engine,
        context,
        input,
    };

    // Combine all this into 1 method
    const updates: Required<Update>[] = [];
    // const transitions = getTransitions()
    const hoverTransition = createHoverTransition(internalEntity);
    const hoverUpdate = createTransitionUpdate(internalEntity, hoverTransition);
    // updates.push(animationUpdates.noise(internalEntity));
    updates.push(hoverUpdate);

    const draw = createDraw(internalEntity);

    const events = createEntityEvents(internalEntity, draw, updates);

    initialize(internalEntity, events);

    return events;
};

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

// lw = not working cause of pixeldensity, better use opacity
const createHoverTransition = ({sketch}: InternalEntity) => {
    const origin = {
        lw: sketch.lw,
        f: sketch.fontSize,
    };
    const steps = 30;
    const lwAdj = 0.1;
    const fAdj = lwAdj / 2;
    const lwRange = lwAdj * steps;
    const fRange = lwRange / 2;

    const forward = () => {
        sketch.lw += lwAdj;
        sketch.fontSize += fAdj;

        if (sketch.lw > origin.lw + lwRange) {
            sketch.lw = origin.lw + lwRange;
            sketch.fontSize = origin.f + fRange;
        }
    };

    const reverse = () => {
        sketch.lw -= lwAdj;
        sketch.fontSize -= fAdj;

        if (sketch.lw < origin.lw) {
            sketch.lw = origin.lw;
            sketch.fontSize = origin.f;
        }
    };

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
    name: 'noName',
    x: 200,
    y: 299,
    w: 150,
    h: 50,
    lw: 2,
    r: 5,
    stroke: '#f00',
    fill: '#000',
    textFill: '#fff',
    text: 'noText',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
    // Mixed Internal Properties
    disabled: false,
    show: true,
    showDelay: 0, // ms
    startType: 'none',
    endType: 'none',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
