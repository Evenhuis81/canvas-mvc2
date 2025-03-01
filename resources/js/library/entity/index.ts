import {createEventHandler} from './handler';
import {getProperties, uid} from 'library/helpers';
import {createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {EntityConfig, EntityGeneric} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';
import initialize from './initialize';
import {createVisual} from './visual';

export default (context: CanvasRenderingContext2D, engine: Engine, input: LibraryInput) =>
    <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>): EntityGeneric<K> => {
        // Extract internal properties from options
        const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

        const sketch = createSketch(type, shape);

        const eventHandler = createEventHandler(input, sketch, listeners);

        // Look @ transition explode callback
        const {getVisual, getDraw} = createVisual(
            generalProperties,
            sketch as EntitySketchMap['button'],
            input,
            context,
        );

        const {show, hide} = initialize(generalProperties, visualProperties, engine, getVisual, getDraw);

        return {
            addListener: eventHandler.addListener,
            removeListener: eventHandler.removeListener,
            // setVisual,
            // setDraw,
            show,
            hide,
            sketch,
        };
    };

// TODO::Set defaults for options if no options is provided (empty entity default)
const extractOptions = <K extends keyof EntityShapeMap>(options: EntityConfig<K> = {}) => {
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

const defaultProperties = {
    // generalProperties (mixed internal properties + id set in abstractOptions)
    name: 'noName', // + counter/uid?
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false, // Also in transitionEventProps
    hideDelay: 0,
    // visualProperties (types can be undefined)
    // animateAtEnd: false,
    // animateAtStart: false,
    // startSpeed: 3,
    // endSpeed: 3,
};
