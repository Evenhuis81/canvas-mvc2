import {createSketchDraw, effects} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {
    EffectType,
    GeneralProperties,
    GetDraw,
    GetVisual,
    Visual,
    VisualNext,
    VisualType,
} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';

export const createVisual = (
    gProps: GeneralProperties,
    sketch: EntitySketchMap['button'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const getVisual: GetVisual = (visualType, effectType, next) => {
        const {render, pre, post} = effects[effectType](sketch, next, input);
        return {
            render: {
                type: 'update',
                id: `${gProps.id}-${visualType}-${effectType}`,
                name: `${visualType} ${effectType}`,
                fn: render,
            },
            pre,
            post,
        };
    };

    const getDraw: GetDraw = () => ({
        render: {
            type: 'draw',
            id: `${sketch.type}-draw`,
            name: `${sketch.type} Draw`,
            fn: createSketchDraw(context, sketch),
        },
    });

    return {
        getVisual,
        getDraw,
    };
};
