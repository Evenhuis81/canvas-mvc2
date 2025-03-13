import {Engine} from 'library/types/engine';
import {EntitySketch} from 'library/types/entity';

type Element<O extends object, K extends keyof O> = {sketch: O[K]; show: () => void};

export type CreateElement<Shapes extends {[K in keyof Shapes]: Shapes[K]}> = <T extends keyof Shapes>(
    type: T,
    shapeConfig?: Partial<Shapes[T]>,
) => Element<Shapes, T>;

export type Entity = <Shapes extends {[K in keyof Shapes]: Shapes[K]}>(
    context: CanvasRenderingContext2D,
    engine: Engine,
    createSketchMap: (context: CanvasRenderingContext2D) => {
        [K in keyof Shapes]: () => EntitySketch<Shapes[K]>;
    },
) => {
    create: CreateElement<Shapes>;
};

export const entity: Entity = (context, engine, createSketchMap) => {
    const sketchMap = createSketchMap(context);

    return {
        create: (type, shapeConfig?) => {
            const sketch = sketchMap[type]();

            Object.assign(sketch.shape, shapeConfig);

            const show = () => engine.setDraw({fn: sketch.draw});

            return {sketch: sketch.shape, show};
        },
    };
};
