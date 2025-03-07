import {Engine} from 'library/types/engine';
import {defaultSketchesDraw} from './sketch';

export const createEntity = <
    // T extends string,
    Sketch extends object,
    Types extends string,
    Sketches extends Record<Types, Sketch>,
    Draws extends {
        [K in keyof Sketches]: (context: CanvasRenderingContext2D) => {draw: () => void; sketch: Sketches[Types]};
    },
>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    draws: Draws,
    // sketches: Sketches,
) => {
    const create = <Type extends Types>(sketchType: Type, sketchConfig: Partial<Sketches[Type]>) => {
        const {draw, sketch} = draws[sketchType](context);

        const sketchFinal = Object.assign(sketch, sketchConfig);

        // for (const key in sketchConfig) {
        //     sketch[key]
        // }

        // const sketchFinal = {...sketches[sketchType], ...sketchConfig, type: sketchType};

        // const show = () => {
        // (context, {...sketches[sketchType], type: sketchType})
        // const sketchDraw = draws[sketchType];

        // sketchDraw(context, sketches[sketchType]);
        //         engine.setDraw({fn: sketchDraw.fn});
        // };

        return {
            sketch: sketchFinal,
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
