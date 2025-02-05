/* eslint-disable max-lines-per-function */
import {createEventHandler} from './handler';
import {createSketch} from './sketch';
import {createUserMethods, defaultProperties} from './properties';
import {createVisualsAndCallbacks} from './animate';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import type {Engine} from 'library/types/engine';
import type {
    Entity,
    EntityConfig,
    EntityConfigT,
    EntityShapeMap,
    EntityT,
    GeneralProperties,
    SketchType,
} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import {Circle, Rect} from 'library/types/shapes';

const rect: Rect & {type: 'rect'} = {
    type: 'rect',
    x: 100,
    y: 50,
    w: 10,
    h: 5,
};

const circle: Circle & {type: 'circle'} = {
    type: 'circle',
    x: 100,
    y: 50,
    radius: 5,
};

const defaultSketch = {
    rect,
    circle,
};

const createSketch = <K extends keyof EntityShapeMap>(type: K): EntityShapeMap[K] => ({
    ...defaultSketch[type],
    // if (type === 'rect') return {...rect};

    // return {
    //     ...defaultSketch[type],
    //     // ...Object.fromEntries(Object.entries(shape).filter(item => Boolean(item[1]))),
    // };
});

export const createEntity = <K extends SketchType>(options?: EntityConfigT): EntityT<K> => {
    return {
        sketch: {},
    };
};

export const getCreateEntity = <T extends keyof ShapeMap>(
    type: keyof ShapeMap,
    context: CanvasRenderingContext2D,
    engine: Engine,
    input: LibraryInput,
    options?: EntityConfig,
): Entity<T> => {
    // Extract internal properties from options
    const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

    const sketch = createSketch(type, shape);

    const eventHandler = createEventHandler(input, sketch, listeners);

    // @type Rect, Circle, Line does not have fill color, make overload function or rehaul colors entirely
    const colors = getSketchRGBAColorsFromHexString(sketch);

    const {setVisual} = createVisualsAndCallbacks(
        generalProperties,
        visualProperties,
        sketch,
        colors,
        input,
        engine,
        context,
        eventHandler,
    ); // Also creates setEngine

    const entity = {
        addListener: eventHandler.addListener,
        removeListener: eventHandler.removeListener,
        setVisual,
        ...createUserMethods(visualProperties, generalProperties, eventHandler),
        sketch,
    };

    initialize(generalProperties, entity);

    return entity;
};

const initialize = (gProps: GeneralProperties, methods: Entity) => {
    if (gProps.show) {
        if (gProps.showDelay) {
            setTimeout(() => {
                gProps.show = false;

                gProps.showDelay = 0;

                methods.show();
            }, gProps.showDelay);

            return;
        }

        methods.show();
    }
};

// TODO::Set defaults for options if no options is provided (empty entity default)
const extractOptions = (options: EntityConfig = {}) => {
    const {id, name, disabled, show, showDelay, clicked, hideDelay, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultProperties, options),
    };

    const generalProperties = {id, name, disabled, show, showDelay, clicked, hideDelay};

    const {start, end, animation, hover, startSpeed, endSpeed, ...rest2} = rest;

    const visualProperties = {
        start,
        end,
        animation,
        hover,
        startSpeed,
        endSpeed,
    };

    const {listeners, sketch: shape} = rest2;

    return {generalProperties, visualProperties, listeners, shape};
};
