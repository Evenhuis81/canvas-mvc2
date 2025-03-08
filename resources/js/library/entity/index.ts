import {Engine} from 'library/types/engine';

export const createEntity = <Sketches extends object>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    // sketches: Sketches,
    // createDraw: <T extends keyof Sketches>(typ: T) => {draw: () => void; sketc: Sketches[T]},
) => {
    const create = <Type extends keyof Sketches>(
        type: Type,
        sketchConfig?: Partial<Sketches[Type]>,
    ): {show: () => void; sketch: Sketches[Type]} => {
        // const {draw, sketch: newSketch} = createSketchAndDraw(type);
        const newSketch = sketches[type];

        // const sketchFinal = Object.assign(newSketch, sketchConfig);
        const sketchFinal = {...sketches[type], ...sketchConfig, type};

        // engine.setDraw({fn: draw});

        return {
            sketch: sketchFinal,
            show: () => {},
        };
    };

    return {create};
};

//     const show = () => {
//         const sketchDraw = createBaseSketchDraw(context, type);

//         engine.setDraw({fn: sketchDraw.fn});
//     };

//     return {
//         sketch,
//         show,
//     };
// }
