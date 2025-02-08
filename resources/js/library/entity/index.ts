import {createEventHandler} from './handler';
import {createUserMethods, defaultProperties} from './properties';
import {createSetVisuals} from './animate';
import {getProperties, uid} from 'library/helpers';
import {getSketchRGBAColorsFromHexString} from 'library/colors';
import {createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {Entity, EntityConfig, EntityGeneric, GeneralProperties} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap} from 'library/types/entitySketch';

export default (context: CanvasRenderingContext2D, engine: Engine, input: LibraryInput) =>
    <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig): EntityGeneric<K> => {
        // Extract internal properties from options
        const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

        // TODO::Overwrite defaults with SketchConfig (user input)
        const sketch = createSketch(type, shape);

        console.log(sketch);

        const eventHandler = createEventHandler(input, sketch, listeners);

        // @type Rect, Circle, Line does not have fill color, make overload function or rehaul colors entirely
        const colors = getSketchRGBAColorsFromHexString(sketch);

        const {setVisual} = createSetVisuals(
            generalProperties,
            visualProperties,
            sketch,
            colors,
            input,
            engine,
            context,
            // eventHandler,
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
