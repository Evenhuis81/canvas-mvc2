import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getHandlers} from './properties';
import type {Resources} from 'library/types';
import {createDraw} from './updates';

const createResource = (resources: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(resources, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Seperate the entity properties from the internal properties
    const {id, name, disabled, show, showDelay, ...sketch} = {
        ...getProperties(defaultSketchProperties, options),
        id: options.id ?? `entity-${uid()}`,
    };

    // mouse + transition handlers mixed
    const handlers = getHandlers(options);

    // Optional?
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

    const updates = createUpdates(internalEntity);

    const draw = createDraw(internalEntity);

    const events = createEntityEvents(internalEntity, draw, updates);

    initialize(internalEntity, events);

    return events;
};

const createUpdates = (entity: InternalEntity) => {
    // const transitions = getTransitions()

    // This is optional, see new InternalEntity properties (hover, hoverType)
    const hoverTransitionUpdate = createHoverTransition(entity);
    // const hoverUpdate = createTransitionUpdate(internalEntity, hoverTransition);
    // updates.push(animationUpdates.noise(internalEntity));
    // updates.push(hoverUpdate);
    return [hoverTransitionUpdate];
};

const createHoverTransition = (entity: InternalEntity) => {
    const {sketch} = entity;

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

    // return {forward, reverse};
    return createTransitionUpdate(entity, {forward, reverse});
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

const defaultSketchProperties = {
    // id created in spreadoperator (1st in line of create method)
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
    // TransitionProperties:
    startType: 'none',
    endType: 'none',
    hover: false,
    hoverType: 'none',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
