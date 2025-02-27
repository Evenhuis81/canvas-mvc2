import {createSketchDraw, getCreateVisual} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {GeneralProperties, GetVisual, Visual, VisualProperties} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';

export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const createVisual = getCreateVisual(sketch, input, vProps);

    const getVisual: GetVisual = (type, effect) => {
        const {render, pre, post} = createVisual[effect]();

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

    return {getVisual, getDraw};
};
