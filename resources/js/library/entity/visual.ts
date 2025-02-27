import {createSketchDraw, getCreateVisual} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {
    EffectType,
    GeneralProperties,
    GetVisual,
    Visual,
    VisualProperties,
    VisualType,
} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';

export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const createVisual = getCreateVisual(sketch, input, vProps);

    const getVisual: GetVisual = (type, effect, next?: () => void) => {
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
            // next: () => {},
        };
    };

    const getDraw = (sketch: EntitySketchMap['button1']): Visual<'draw'> => {
        return {
            render: {
                type: 'draw',
                id: `${sketch.type}-draw`,
                name: `${sketch.type} Draw`,
                fn: createSketchDraw(context, sketch),
            },
        };
    };

    // TODOS::Sketch optional (duration only with phaser)

    return {getVisual, getDraw};
};
