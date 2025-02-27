import {createSketchDraw, getCreateVisual} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {
    GeneralProperties,
    GetVisual,
    SetDraw,
    Visual,
    VisualProperties,
    VisualType,
    Visuals,
} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';
import {UpdateOrDraw} from 'library/types/engine';

export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const createVisual = getCreateVisual(sketch, input, vProps);
    const visuals: Partial<Visuals> = {};

    const getVisual: GetVisual = (
        type,
        effect,
        next?: () => void,
    ): Omit<Visual, 'render'> & {render: UpdateOrDraw<'update' | 'draw'>} => {
        const {render, pre, post} = createVisual[effect](next);

        return {
            render: {
                type: 'update',
                id: `${gProps.id}-${type}-${effect}`,
                name: `${type} ${effect}`,
                fn: render,
            },
            pre,
            post,
        };
    };

    const setDraw: SetDraw = sketch => {
        const visual: Visuals['draw'] = {
            render: {
                type: 'draw',
                id: `${sketch.type}-draw`,
                name: `${sketch.type} Draw`,
                fn: createSketchDraw(context, sketch),
            },
            // pre,
            // post,
            // next,
        };

        visuals.draw = visual;
    };

    // TODOS::Sketch optional (duration only with phaser)
    setDraw(sketch);

    return {visuals, getVisual, setDraw};
};
