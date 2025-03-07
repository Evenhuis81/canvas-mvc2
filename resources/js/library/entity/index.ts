import {Engine} from 'library/types/engine';

export const createEntity = <Sketches extends object>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    drawAndSketch: <T extends keyof Sketches>(
        type: T,
        context: CanvasRenderingContext2D,
    ) => {draw: () => void; sketch: Sketches[T]},
) => {
    const create = <K extends keyof Sketches>(sketchType: K, sketchConfig: Partial<Sketches[K]>) => {
        const {draw, sketch: newSketch} = drawAndSketch(sketchType, context);

        // const sketchFinal = Object.assign(sketch, sketchConfig);
        // const sketchFinal = {...sketches[sketchType], ...sketchConfig, type: sketchType};

        // const show = () => {
        // (context, {...sketches[sketchType], type: sketchType})
        // const sketchDraw = draws[sketchType];

        engine.setDraw({fn: draw});

        return {
            create,
            // sketch: newSketch,
            // show,
        };
    };
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
