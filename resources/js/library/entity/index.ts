import {createEventHandler} from './handler';
import {setVisuals} from './visual';
import {getProperties, uid} from 'library/helpers';
import {createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {
    EngineState,
    Entity,
    EntityConfig,
    EntityGeneric,
    GeneralProperties,
    VisualType,
    Visuals,
} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';

export default (context: CanvasRenderingContext2D, engine: Engine, input: LibraryInput) =>
    <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>): EntityGeneric<K> => {
        // Extract internal properties from options
        const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

        const sketch = createSketch(type, shape);

        const eventHandler = createEventHandler(input, sketch, listeners);

        // Look @ transition explode callback
        const {setVisual, setDraw, visuals} = setVisuals(
            generalProperties,
            visualProperties,
            sketch as EntitySketchMap['button1'],
            input,
            context,
        );

        initialize(generalProperties, show);

        return {
            addListener: eventHandler.addListener,
            removeListener: eventHandler.removeListener,
            setVisual,
            setDraw,
            // ...createUserMethods(generalProperties, eventHandler, callbacks),
            show,
            hide,
            setHideTime,
            sketch,
        };
    };

// const {setEngine, visuals} = createSetEngine(engine);
// const callbacks = createCallbacks(setEngine, eventHandler);

// const show = () => {
//     if (generalProperties.show) return console.log('show is already active');

//     generalProperties.show = true;

//     // callbacks.start();
// };

// const hide = () => {
//     if (!generalProperties.show) return console.log('hide is already active');

//     generalProperties.show = false;

//     // callbacks.end();
// };

// const setHideTime = (time: number) => (generalProperties.hideDelay = time);

// // TODO::This needs options (ie. run pre/post?, transitionSpeed, listener handling, etc...)
// const createSetEngine = (engine: Engine) => {
//     const setEngine = (type: VisualType, state: EngineState) => {
//         const visual = visuals[type];

//         if (!visual) return setEngineLog(type, state);

//         if (state === 'on' && visual.pre) visual.pre();

//         return engine.handle(visual.render, state === 'on');
//     };

//     return {setEngine, visuals};
// };

// const setEngineLog = (type: string, state: string) =>
//     console.log(`setEngine: ${type} is not set, state: ${state}`);

const initialize = (gProps: GeneralProperties, show: Entity['show']) => {
    // show is used initially to show or hide when no showDelay is set. After it's used internally to indicate if entity is active
    if (!gProps.show && !gProps.showDelay) return;

    if (gProps.showDelay) {
        setTimeout(() => {
            show();
        }, gProps.showDelay);

        gProps.show = false;
        gProps.showDelay = 0;

        return;
    }

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
