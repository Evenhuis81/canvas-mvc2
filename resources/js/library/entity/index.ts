import {createEventHandler} from './handler';
import {createUserMethods, defaultProperties} from './properties';
import {setVisuals} from './animate';
import {getProperties, uid} from 'library/helpers';
import {createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {EntityConfig, EntityGeneric, GeneralProperties} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap} from 'library/types/entitySketch';

export default (context: CanvasRenderingContext2D, engine: Engine, input: LibraryInput) =>
    <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>): EntityGeneric<K> => {
        // Extract internal properties from options
        const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

        const sketch = createSketch(type, shape);

        const eventHandler = createEventHandler(input, sketch, listeners);

        const {setVisual} = setVisuals(
            generalProperties,
            visualProperties,
            sketch,
            input,
            engine,
            context,
            // eventHandler,
        ); // Also creates setEngine

        const entity: EntityGeneric<K> = {
            addListener: eventHandler.addListener,
            removeListener: eventHandler.removeListener,
            setVisual,
            ...createUserMethods(visualProperties, generalProperties, eventHandler),
            sketch,
        };

        initialize(generalProperties, entity.show);

        console.log(sketch);

        return entity;
    };

const initialize = (gProps: GeneralProperties, show: () => void) => {
    if (gProps.show) {
        if (gProps.showDelay) {
            setTimeout(() => {
                gProps.show = false;

                gProps.showDelay = 0;

                show();
            }, gProps.showDelay);

            return;
        }

        show();
    }
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
