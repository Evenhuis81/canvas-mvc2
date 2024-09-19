import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getHandlers} from './properties';
import {createDraw, createUpdates} from './updates';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import type {Resources} from 'library/types';

const createResource = (resources: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(resources, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Seperate the entity properties from the internal properties
    const {
        id,
        name,
        disabled,
        show,
        showDelay,
        hoverType,
        startType,
        startSpeed,
        endType,
        endSpeed,
        mouse,
        onStartEnd,
        onEndEnd,
        animation,
        ...sketch
    } = {
        ...getProperties(options, defaultSketchProperties),
        id: options.id ?? `entity-${uid()}`,
    };

    // Make this more efficient, if no transitions or rgba color needed, make simple update/draw method, etc.
    const colors = getSketchRGBAColorsFromHexString(sketch);

    // mouse + transition handlers mixed
    const handlers = getHandlers({...mouse}, {onStartEnd, onEndEnd});

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
            startSpeed,
            endType,
            endSpeed,
            animation,
        },
        sketch,
        handlers,
        listeners,
        engine,
        context,
        input,
        colors,
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
    animation: 'none',
    // TransitionProperties:
    startType: 'none',
    startSpeed: 2,
    endType: 'none',
    endSpeed: 2,
    hoverType: 'none',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
