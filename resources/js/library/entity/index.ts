/* eslint-disable max-lines-per-function */
import {createEntityEvents, createListeners, createRender, getHandlers} from './properties';
import {createRendersAndCallBacks} from './animate';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {resources} from '..';
import type {Resources} from 'library/types';

const createResource = (res: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(res, options),
});

const create = ({context, engine, input}: Resources, options: Partial<EntityConfig> = {}) => {
    // Extract internal properties from entity config options
    const {id, name, disabled, show, showDelay, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultSketchProperties, options),
    };

    const properties = {id, name, disabled, show, showDelay};

    const {startType, startSpeed, endType, endSpeed, hoverType, animationType, ...rest2} = rest;

    const animations = {startType, startSpeed, endType, endSpeed, hoverType, animationType};

    // mouse + transition handlers mixed
    const {mouse, onStartEnd, onEndEnd, ...sketch} = rest2;

    const handlers = getHandlers({...mouse}, {...(onStartEnd && {onStartEnd}), ...(onEndEnd && {onEndEnd})});

    const listeners = createListeners(sketch, handlers, input);

    const colors = getSketchRGBAColorsFromHexString(sketch);

    const startEnd = () => {
        engine.removeUpdate(renders.start.id);

        if (internalEntity.animations.animationType) engine.setUpdate(renders.animation);
        if (internalEntity.animations.hoverType) engine.setUpdate(renders.hover);

        internalEntity.handlers.onStartEnd();
    };

    const endEnd = () => {
        engine.removeUpdate(renders.end.id);

        if (internalEntity.animations.animationType) engine.removeUpdate(renders.animation.id);
        if (internalEntity.animations.hoverType) engine.removeUpdate(renders.hover.id);

        internalEntity.handlers.onEndEnd();
    };

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
        callBacks: {
            startEnd,
            endEnd,
        },
    };

    // const callBacks = getCallBacks(engine, renders, animations, handlers);

    const {renders, callBacks} = createRendersAndCallBacks(internalEntity);

    console.log(renders);

    const render = createRender(engine, renders);

    const events = createEntityEvents(internalEntity, render);

    initialize(internalEntity, events);

    return events;
};

const getCallBacks = (
    engine: Engine,
    renders: EntityRenders,
    animations: InternalEntity['animations'],
    handlers: InternalEntity['handlers'],
) => {
    const startEnd = () => {
        console.log('startEnd called');

        engine.removeUpdate(renders.start.id);
        if (animations.animationType) engine.setUpdate(renders.animation);
        if (animations.hoverType) engine.setUpdate(renders.hover);
        handlers.onStartEnd();
    };

    const endEnd = () => {
        // Unfinished
        console.log('startEnd called');

        engine.removeUpdate(renders.end.id);
    };

    return {endEnd, startEnd};
};

const initialize = ({properties}: InternalEntity, events: EntityEvents) => {
    if (properties.show) {
        // Optional setTimeout needed? (mind the 'on top of stack')
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
    // Animation Properties, undefined stays undefined
    // animationType: undefined,
    // hoverType: undefined,
    // startType: undefined,
    // endType: undefined,
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
