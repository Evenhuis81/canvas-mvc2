/* eslint-disable max-lines-per-function */
import {createVisualsAndCallbacks} from './animate';
import {createListenerMethods, createListeners} from './properties';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {resources} from '..';
import {UserConfig} from 'library/types/entity';

const createResource = (res: Resources) => ({
    create: (options?: Partial<UserConfig>) => create(res, options),
});

const create = ({context, engine, input}: Resources, options: Partial<UserConfig> = {}) => {
    // Extract internal properties from entity config options, TODO::See SketchType in entity.d.t.s
    const {properties, visualProperties, userListeners, sketch} = extractOptions(options);

    const colors = getSketchRGBAColorsFromHexString(sketch);

    const {setListener, listeners} = createListeners(userListeners);

    const listenerMethods = createListenerMethods(listeners);

    // const entityListeners = createEntityListeners(entity1);

    const {callbacks, setVisual} = createVisualsAndCallbacks(entity1); // Also creates setEngine

    const entity = {...entity1, entityListeners, callbacks};

    const userMethods = {setListener, setVisual, ...createUserEntity(entity)};

    initialize(entity, userMethods);

    return userMethods;
};

const initialize = ({properties}: Entity, methods: UserEntity) => {
    if (properties.show) {
        // Test optional setTimeout (mind the 'on top of stack')
        setTimeout(() => {
            properties.show = false;

            // one time calling show with showDelay?
            properties.showDelay = 0;

            methods.show();
        }, properties.showDelay);
    }

    // if (properties.disabled) {
    //     properties.disabled = false;

    //     methods.disable();
    // }
};

const extractOptions = (options: Partial<EntityConfig>) => {
    const {id, name, disabled, show, showDelay, clicked, hideTime, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultSketchProperties, options),
    }; // Add statistics options -> internal options view
    const properties = {id, name, disabled, show, showDelay, clicked, hideTime};

    const {startType, startSpeed, endType, endSpeed, hoverType, animationType, animateAtStart, animateAtEnd, ...rest2} =
        rest;
    const visualProperties = {
        startType,
        startSpeed,
        endType,
        endSpeed,
        hoverType,
        animationType,
        animateAtStart,
        animateAtEnd,
    };

    const {listeners: userListeners, ...sketch} = rest2;

    return {properties, visualProperties, userListeners, sketch};
};

const defaultSketchProperties = {
    // Mixed Internal Properties (+id from creation)
    name: 'noName', // + Counter?
    type: 'default',
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false,
    hideTime: 0,
    // Visual Properties (visual types can be undefined)
    animateAtStart: false,
    animateAtEnd: false,
    startSpeed: 3,
    endSpeed: 3,
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
