import {Engine} from 'library/types/engine';

// drawAndSketch:

export const createEntity = <SketchesAndDraws extends object>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    createSketchAndDraw: <T extends keyof SketchesAndDraws>(type: T) => {draw: () => void; sketch: SketchesAndDraws[T]},
) => {
    const create = <Type extends keyof SketchesAndDraws>(type: Type) => {
        const {draw, sketch: newSketch} = createSketchAndDraw(type);

        // const sketchFinal = Object.assign(sketch, sketchConfig);
        // const sketchFinal = {...sketches[sketchType], ...sketchConfig, type: sketchType};

        engine.setDraw({fn: draw});

        return {
            sketch: newSketch,
            draw,
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
