import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getHandlers} from './properties';
import type {Resources} from 'library/types';
import {createDraw, createUpdates} from './updates';
import {hexToRgb} from 'library/colors';

const createResource = (resources: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(resources, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Seperate the entity properties from the internal properties
    const {id, name, disabled, show, showDelay, hoverType, startType, endType, mouse, ...sketch} = {
        ...getProperties(options, defaultSketchProperties),
        id: options.id ?? `entity-${uid()}`,
    };

    const rgba = {
        fill: {a: 1, ...hexToRgb(sketch.fill)},
        stroke: {a: 1, ...hexToRgb(sketch.stroke)},
        textFill: {a: 1, ...hexToRgb(sketch.textFill)},
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
            hoverType,
            startType,
            endType,
        },
        sketch,
        handlers,
        listeners,
        engine,
        context,
        input,
        colors: {
            fill: rgba.fill,
            stroke: rgba.stroke,
            textFill: rgba.textFill,
        },
    };

    const updates = createUpdates(internalEntity);

    const draw = createDraw(internalEntity);

    const events = createEntityEvents(internalEntity, updates, draw);

    initialize(internalEntity, events);

    return events;
};

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
    hoverType: 'none',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
