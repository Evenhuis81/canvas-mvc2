import {getProperties, uid} from 'library/helpers';
import {BaseSketch, createBaseSketch, createSketch} from './sketch';
import type {Engine} from 'library/types/engine';
import type {EntityConfig, EntityGeneric} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';
import initialize from './initialize';
import {createVisual} from './visual';

export const baseEntity = <T extends keyof BaseSketch>(
    type: T,
    context: CanvasRenderingContext2D,
    engine: Engine,
): BaseSketch[T] => {
    const sketch = createBaseSketch(type);

    return sketch;

    // <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>): EntityGeneric<K> => {
    // const {generalProperties, visualProperties, listeners, shape} = extractOptions(options);

    // const eventHandler = createEventHandler(input, sketch, listeners);

    // const {getVisual, getDraw} = createVisual(
    //     generalProperties,
    //     sketch as EntitySketchMap['button'],
    //     input,
    //     context,
    // );

    // const {start, end} = initialize(generalProperties, visualProperties, eventHandler, engine, getVisual, getDraw);

    // return {
    //     addListener: eventHandler.addListener,
    //     removeListener: eventHandler.removeListener,
    //     // setVisual,
    //     // setDraw,
    //     start,
    //     end,
    //     sketch,
    // };
};

// TODO::Set defaults for options if no options is provided (empty entity default)
// const extractOptions = <K extends keyof EntityShapeMap>(options: EntityConfig<K> = {}) => {
//     const {id, name, disabled, show, showDelay, clicked, hideDelay, ...rest} = {
//         id: options.id ?? `entity-${uid()}`,
//         ...getProperties(defaultProperties, options),
//     };

//     const generalProperties = {id, name, disabled, show, showDelay, clicked, hideDelay};

//     const {start, end, animation, hover, startSpeed, endSpeed, ...rest2} = rest;

//     const visualProperties = {
//         start,
//         end,
//         animation,
//         hover,
//         startSpeed,
//         endSpeed,
//     };

//     const {listeners, sketch: shape} = rest2;

//     return {generalProperties, visualProperties, listeners, shape};
// };
