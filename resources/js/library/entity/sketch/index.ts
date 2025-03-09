import {Engine} from 'library/types/engine';

type EntitySketch<O extends object, T extends keyof O> = {
    draw: (dT: DOMHighResTimeStamp) => void;
    shape: O[T];
};

// {
//     draw: () => void;
//     shape: EntityShapes[K];
// }

export const createEntity = <EntityShapes extends {[K in keyof EntityShapes]: object}>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    createGetSketch: (ctx: CanvasRenderingContext2D) => {
        [K in keyof EntityShapes]: () => EntitySketch<EntityShapes, K>;
    },
) => {
    const getSketch = createGetSketch(context);

    const create = <T extends keyof EntityShapes>(
        type: T,
        shapeConfig?: Partial<EntityShapes[T]>,
    ): EntitySketch<EntityShapes, T> => {
        const sketch = getSketch[type]();

        Object.assign(sketch, shapeConfig);

        // Not here? = test
        engine.setDraw({fn: sketch.draw});

        return sketch;
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
