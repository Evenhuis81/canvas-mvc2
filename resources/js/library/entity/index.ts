import {createEventHandler} from './handler';
import {createUserMethods, defaultProperties} from './properties';
import {setVisuals} from './animate';
import {getProperties, uid} from 'library/helpers';
import {createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {Entity, EntityConfig, EntityGeneric, GeneralProperties, Visuals} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';
import {createSetEngine} from './setEngine';
import {createCallbacks} from './callback';

export default (context: CanvasRenderingContext2D, engine: Engine, input: LibraryInput) =>
    <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>): EntityGeneric<K> => {
        // Extract internal properties from options
        const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

        const sketch = createSketch(type, shape);

        const eventHandler = createEventHandler(input, sketch, listeners);

        const visuals: Partial<Visuals> = {};

        const setEngine = createSetEngine(engine, visuals);

        const callbacks = createCallbacks(setEngine, eventHandler);

        // Make sketch(Map) dynamic and create generic to add 'theme' sketches from library
        const {setVisual, setDraw} = setVisuals(
            generalProperties,
            visualProperties,
            sketch as EntitySketchMap['button1'],
            input,
            context,
            visuals,
            callbacks,
        );

        const entity: EntityGeneric<K> = {
            addListener: eventHandler.addListener,
            removeListener: eventHandler.removeListener,
            setVisual,
            setDraw,
            ...createUserMethods(generalProperties, eventHandler, callbacks),
            sketch,
        };

        initialize(generalProperties, entity.show);

        return entity;
    };

const initialize = (gProps: GeneralProperties, show: Entity['show']) => {
    // show is used initially to show or hide when no showDelay is set. After it's used internally to indicate if entity is active
    if (!gProps.show && !gProps.showDelay) return;

    if (gProps.showDelay) {
        setTimeout(() => {
            show();
            gProps.show = true;
        }, gProps.showDelay);

        gProps.show = false;
        gProps.showDelay = 0;

        return;
    }

    gProps.show = true;
    show();
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
