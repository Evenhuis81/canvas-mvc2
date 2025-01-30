import {createEventHandler} from './handler';
import {createSketch} from './sketch';
import {createUserMethods, defaultProperties} from './properties';
import {createVisualsAndCallbacks} from './animate';

import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import type {Engine} from 'library/types/engine';
import type {Entity, EntityConfig, GeneralProperties} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';

export const getCreateEntity = (
    context: CanvasRenderingContext2D,
    engine: Engine,
    input: LibraryInput,
    options?: EntityConfig,
) => {
    // Extract internal properties from options
    const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

    const sketch = createSketch(shape);

    const eventHandler = createEventHandler(input, sketch, listeners);

    // @type Rect, Circle, Line does not have fill color, make overload function or rehaul colors entirely
    const colors = getSketchRGBAColorsFromHexString(sketch);

    const {callbacks, setVisual} = createVisualsAndCallbacks(
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
        ...createUserMethods(visualProperties, generalProperties, callbacks, eventHandler),
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

                return;
            }, gProps.showDelay);
        }

        methods.show();

        return;
    }
};

// TODO::Set defaults for options if no options is provided (empty entity default)
const extractOptions = (options: EntityConfig = {}) => {
    const {id, name, disabled, show, showDelay, clicked, hideDelay, ...rest} = {
        id: options.id ?? `entity-${uid()}`,
        ...getProperties(defaultProperties, options),
    };

    const generalProperties = {id, name, disabled, show, showDelay, clicked, hideDelay};

    const {startTransition, endTransition, animation, hover, startSpeed, endSpeed, ...rest2} = rest;

    const visualProperties = {
        startTransition,
        endTransition,
        animation,
        hover,
        startSpeed,
        endSpeed,
    };

    const {listeners, sketch: shape} = rest2;

    return {generalProperties, visualProperties, listeners, shape};
};
