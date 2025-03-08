import {Engine} from 'library/types/engine';

type EntitySketch<O extends object, T extends keyof O> = {
    draw: (c: CanvasRenderingContext2D, dT: DOMHighResTimeStamp) => void;
    shape: O[T];
};

export const createEntity = <EntityShapes extends {[K in keyof EntityShapes]: object}>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    shapes: EntityShapes,
    drawings: (
        context: CanvasRenderingContext2D,
        shapes: EntityShapes,
    ) => {[K in keyof EntityShapes]: () => () => void},
) => {
    const drawing = drawings(context, shapes);

    const create = <T extends keyof EntityShapes>(
        type: T,
        shapeConfig?: Partial<EntityShapes[T]>,
    ): EntitySketch<EntityShapes, T> => {
        const shape = shapes[type];

        Object.assign(shape, shapeConfig);

        return {
            draw: drawing[type](),
            shape,
        };
    };

    return {
        create,
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
