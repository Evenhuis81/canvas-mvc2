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
    // const {
    //     id,
    //     name,
    //     disabled,
    //     show,
    //     showDelay,
    //     animation,
    //     ...restoptions
    // } = {
    //     ...getProperties(options, defaultSketchProperties),
    //     id: options.id ?? `entity-${uid()}`,
    // };
    const propertiesLength = [6, 5]; // [Mixed Internal Properties, Transition Properties]

    const internal = {id: options.id ?? `entity-${uid()}`, ...getProperties(options, defaultSketchProperties)};

    const splitObject = (obj: {}, ids: []) => {
        const returnObj = {};

        ids.forEach(idd => {
            // const {idd: } = obj;
            // returnObj[id] = idd;
        });
    };

    console.log(internal.id);

    type Propp = {id: string | number};

    const properties: Propp = {id: 0};

    // const properties = splitObject(internal, Object.keys(internal).splice(0, propertiesLength[0]));

    ({id: properties.id} = internal);

    console.log(internal.animation);

    const {animation} = internal;

    console.log(internal.animation);

    // const {id, name, disabled, show, showDelay, animation} = internal;

    // const propertyKeys = ['id', 'name', 'disabled', 'show', 'showDelay', 'animation'];

    // Object.keys(internal));

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
            animation,
        },
        transitions: {
            hoverType,
            startType,
            startSpeed,
            endType,
            endSpeed,
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
    // Mixed Internal Properties (+id from creation)
    name: 'noName',
    disabled: false,
    show: true,
    showDelay: 0,
    animation: 'none',
    // Transition Properties
    startType: 'none',
    startSpeed: 2,
    endType: 'none',
    endSpeed: 2,
    hoverType: 'none',
    // Sketch
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
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
