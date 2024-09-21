import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import {createEntityEvents, createListeners, getHandlers} from './properties';
import {createRenders} from './animate';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import type {Resources} from 'library/types';

const createResource = (resources: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(resources, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Extract internal properties from entity config options, TODO::Create methods, see comments for starters
    const {id, name, disabled, show, showDelay, animationType, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(options, defaultSketchProperties),
    };

    const properties = {id, name, disabled, show, showDelay, animationType};

    const {startType, startSpeed, endType, endSpeed, hoverType, ...rest2} = rest;

    const transitions = {startType, startSpeed, endType, endSpeed, hoverType};

    const {mouse, onStartEnd, onEndEnd, ...sketch} = rest2;

    // mouse + transition handlers mixed
    const handlers = getHandlers({...mouse}, {onStartEnd, onEndEnd});

    const listeners = createListeners(sketch, handlers, input);

    const colors = getSketchRGBAColorsFromHexString(sketch);

    const setEngine = (renders: EntityRenders) => {
        console.log('setting engine', renders);
    };

    const internalEntity: InternalEntity = {
        properties,
        transitions,
        sketch,
        handlers,
        listeners,
        colors,
        engine,
        context,
        input,
        setEngine,
    };

    const renders = createRenders(internalEntity);

    const events = createEntityEvents(internalEntity, renders);

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
    animationType: 'none',
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
