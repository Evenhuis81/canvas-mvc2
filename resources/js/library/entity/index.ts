/* eslint-disable max-lines-per-function */
import {createEntityEvents, createListeners, getHandlers} from './properties';
import {createRenders} from './animate';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {resources} from '..';
import type {Resources} from 'library/types';

const createResource = (res: Resources) => ({
    create: (options?: Partial<EntityConfig>) => create(res, options),
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

    // mouse + transition handlers mixed
    const {mouse, onStartEnd, onEndEnd, ...sketch} = rest2;
    const handlers = getHandlers({...mouse}, {onStartEnd, onEndEnd});

    const listeners = createListeners(sketch, handlers, input);
    const colors = getSketchRGBAColorsFromHexString(sketch);

    // const getSwitches = () => ({
    //     draw: 'on',
    //     hover: transitions.hoverType ? 'on' : undefined,
    //     animation: properties.animationType ? 'on' : undefined,
    //     start: transitions.startType ? 'on' : undefined,
    //     end:
    // });
    // const switches = getSwitches();
    // const startT = transitions.startType ? 'on' : undefined

    const createSetEngine = (renders: Partial<EntityRenderers>) => (switches: Partial<EntityEngineSwitches>) => {
        // // const cbf = () => {}

        console.log(renders, switches);

        // console.log(Object.entries(switches));
        // Object.entries(switches).forEach(zwitch => {
        //     console.log(zwitch);
        // });
    };

    // Would like to have setEngine be part of internalEntity, but since it creates an unfinished loop, I have to
    // keep track of where it is used and call for it individually. (just createEntityEvents for now or ever?)
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
    };

    const renders = createRenders(internalEntity);

    const setEngine = createSetEngine(renders);

    const events = createEntityEvents(internalEntity, setEngine);

    initialize(internalEntity, events);

    return events;
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
    animationType: undefined,
    // Transition Properties
    hoverType: undefined,
    startType: undefined,
    startSpeed: 2,
    endType: undefined,
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
