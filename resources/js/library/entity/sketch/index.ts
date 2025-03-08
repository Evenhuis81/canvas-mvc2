import {Engine} from 'library/types/engine';
import {EntitySketch, Shapes} from './types';

export const createEntity = <EntityShapes extends object>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    createShape: () => void,
    createDraw: () => void,
) => {
    // export type EntitySketch<S extends keyof Shapes> = {
    //     draw: (c: CanvasRenderingContext2D, dT: DOMHighResTimeStamp) => void;
    //     shape: Shapes[S];
    // };
    const createSketch = <T extends keyof Shapes>(type: T, context: CanvasRenderingContext2D): EntitySketch<T> => {
        const shape = createShape();
        const draw = createDraw(context, shape);

        return {
            draw: draw[type],
            shape: shape[type],
        };
    };
};

// const create = <Type extends keyof Sketches>(
//     type: Type,
//     sketchConfig?: Partial<Sketches[Type]>,
// ): {show: () => void; sketch: Sketches[Type]} => {
//     // const {draw, sketch: newSketch} = createSketchAndDraw(type);
//     const newSketch = sketches[type];

//     // const sketchFinal = Object.assign(newSketch, sketchConfig);
//     const sketchFinal = {...sketches[type], ...sketchConfig, type};

//     // engine.setDraw({fn: draw});

//     return {
//         sketch: sketchFinal,
//         show: () => {},
//     };
// };

// return {create};
