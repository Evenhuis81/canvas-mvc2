import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import type {ConfigOptions, EntityMethods, GeneralProperties} from 'library/types/entity';
import {createHandler} from './handler';

const createResource = (res: Resources) => ({
    create: (options?: Partial<ConfigOptions>) => create(res, options),
});

const create = ({context, engine, input}: Resources, options: Partial<ConfigOptions> = {}) => {
    // Extract internal properties from options
    const {generalProperties, visualProperties, listenerOptions, sketch} = extractOptions(options);

    const {setListener, handler} = createHandler(listenerOptions);

    // const listenerMethods = createListenerMethods(listeners);

    // const entityListeners = createEntityListeners(entity1);

    // const {callbacks, setVisual} = createVisualsAndCallbacks(entity1); // Also creates setEngine

    // const entity = {...entity1, entityListeners, callbacks};

    // Mix-in with draw method
    // const colors = getSketchRGBAColorsFromHexString(sketch);
    // const userMethods = {setListener, setVisual, ...createUserEntity(entity)};

    // initialize(entity, userMethods);

    // return userMethods;
};

const initialize = (gProps: GeneralProperties, methods: EntityMethods) => {
    if (gProps.show) {
        // Test optional setTimeout efficiency
        setTimeout(() => {
            gProps.show = false;

            // TODO::Make this optional (or with entityMethod)
            gProps.showDelay = 0;

            methods.show();
        }, gProps.showDelay);
    }
};

const extractOptions = (options: Partial<ConfigOptions>) => {
    const {id, name, disabled, show, showDelay, clicked, hideTime, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultProperties, options),
    };

    const generalProperties = {id, name, disabled, show, showDelay, clicked, hideTime};

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

    const {listeners: listenerOptions, ...sketch} = rest2;

    return {generalProperties, visualProperties, listenerOptions, sketch};
};

const defaultProperties = {
    // generalProperties (mixed internal properties + id set in abstractOptions)
    name: 'noName', // + counter/uid?
    type: 'default',
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false,
    hideTime: 0,
    // visualProperties (types can be undefined)
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
