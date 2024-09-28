/* eslint-disable max-lines-per-function */
import {createEntityEvents, createListeners, getHandlers} from './properties';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {resources} from '..';
import type {Resources} from 'library/types';
import {createCallBacks} from './animate';

const createResource = (res: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(res, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Extract internal properties from entity config options
    const {id, name, disabled, show, showDelay, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultSketchProperties, options),
    };
    // Add statistics options -> internal options view

    const properties = {id, name, disabled, show, showDelay};

    const {startType, startSpeed, endType, endSpeed, hoverType, animationType, ...rest2} = rest;

    const animations = {startType, startSpeed, endType, endSpeed, hoverType, animationType};

    // mouse + transition handlers mixed
    const {mouse, onStartEnd, onEndEnd, ...sketch} = rest2;

    const colors = getSketchRGBAColorsFromHexString(sketch);

    const handlers = getHandlers({...mouse}, {...(onStartEnd && {onStartEnd}), ...(onEndEnd && {onEndEnd})});

    const listeners = createListeners(sketch, handlers, input);

    const internalEntity: InternalEntity = {
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

    // returns callBacks... transform to something more generic (read comment on return of createRenders)
    const callBacks = createCallBacks(internalEntity);

    const events = createEntityEvents(internalEntity, callBacks);

    // CallBacks and events are mixed up, combine and add them all into callbacks (internal and external)
    initialize(internalEntity, events);

    return events;
};

const initialize = ({properties}: InternalEntity, events: EntityEvents) => {
    if (properties.show) {
        // Test optional setTimeout (mind the 'on top of stack')
        setTimeout(() => {
            properties.show = false;

            properties.showDelay = 0; // one time calling show with showDelay

            // Possible option to never or always show start- and endTransitions depending on user choice
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
    name: 'noName',
    disabled: false,
    show: true,
    showDelay: 0,
    // Animation Properties
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
    text: 'Insert Text',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};

// TODO::Resource availability check
export default (resourceID: string | number) => createResource(resources[resourceID]);
