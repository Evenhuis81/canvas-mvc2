/* eslint-disable max-lines-per-function */
import {createEntityEvents, createListeners, getHandlers} from './properties';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {resources} from '..';
import {createCallBacks} from './animate';

const createResource = (res: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(res, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Extract internal properties from entity config options
    const {id, name, disabled, show, showDelay, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultSketchProperties, options),
    }; // Add statistics options -> internal options view
    const properties = {id, name, disabled, show, showDelay};

    // mouse + transition handlers mixed
    const {mouse, onStartEnd, onEndEnd, ...rest2} = rest;

    const handlers = getHandlers({...mouse}, {...(onStartEnd && {onStartEnd}), ...(onEndEnd && {onEndEnd})});

    const {
        startType,
        startSpeed,
        endType,
        endSpeed,
        hoverType,
        animationType,
        animateAtStart,
        animateAtEnd,
        ...sketch
    } = rest2;

    const animations = {
        startType,
        startSpeed,
        endType,
        endSpeed,
        hoverType,
        animationType,
        animateAtStart,
        animateAtEnd,
    };

    const colors = getSketchRGBAColorsFromHexString(sketch);

    const listeners = createListeners(sketch, handlers, input);

    const entity: InternalEntity = {
        properties,
        animations,
        sketch,
        handlers,
        listeners,
        colors,
        engine,
        context,
        input,
    };

    const callBacks = createCallBacks(entity);

    const events = createEntityEvents(entity, callBacks);

    initialize(entity, events);

    // Make sure entity is not active (ie. listeners, add) when handlers are not yet set from outside

    const setHandlers = (handlers: MouseHandlers & TransitionHandlers) => {
        //
    };

    return {
        setHandlers,
        ...events,
    };
};

const initialize = ({properties}: InternalEntity, events: EntityEvents) => {
    if (properties.show) {
        // Test optional setTimeout (mind the 'on top of stack')
        setTimeout(() => {
            properties.show = false;

            properties.showDelay = 0; // one time calling show with showDelay

            events.show();
        }, properties.showDelay);
    }

    if (properties.disabled) {
        properties.disabled = false;

        events.disable();
    }
};

const defaultSketchProperties = {
    // Mixed Internal Properties (+id from creation)
    name: 'noName', // + Counter?
    type: 'default',
    disabled: false,
    show: true,
    showDelay: 0,
    // Animation Properties ('none' -> undefined?)
    animateAtStart: false,
    animateAtEnd: false,
    animationType: 'none',
    hoverType: 'none',
    startType: 'none',
    endType: 'none',
    startSpeed: 2,
    endSpeed: 2,
    // Sketch
    x: 300,
    y: 200,
    w: 100,
    h: 50,
    lw: 2,
    r: 5,
    stroke: '#f00',
    fill: '#000',
    textFill: '#fff',
    text: 'Entity',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
