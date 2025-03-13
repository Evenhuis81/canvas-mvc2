import {Engine} from 'library/types/engine';
import {EntitySketch} from 'library/types/entity';
import {ShapeMap} from './defaults/shapes';

// Temp till better name found
type Sketch<T extends keyof ShapeMap> = {sketch: ShapeMap[T]; show: () => void};

export const entity = <EntityShapes extends {[K in keyof EntityShapes]: EntityShapes[K]}>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    createSketchMap: (ctx: CanvasRenderingContext2D) => {
        [K in keyof EntityShapes]: () => EntitySketch<EntityShapes[K]>;
    },
) => {
    const sketchMap = createSketchMap(context);

    const create = <T extends keyof EntityShapes>(type: T, shapeConfig?: Partial<EntityShapes[T]>): Sketch<T> => {
        const sketch = sketchMap[type]();

        Object.assign(sketch.shape, shapeConfig);

        const show = () => engine.setDraw({fn: sketch.draw});

        return {sketch: sketch.shape, show};
    };

    return {
        create,
    };
};
