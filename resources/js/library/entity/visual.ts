import {createSketchDraw, effects} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {
    EffectType,
    GeneralProperties,
    GetDraw,
    Visual,
    VisualConfig,
    VisualCreation,
    VisualNext,
    VisualProperties,
    VisualType,
} from 'library/types/entity';
import type {BaseSketch, EntitySketchMap} from 'library/types/entitySketch';

export const createVisual = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: BaseSketch,
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const getVisual = (visualType: VisualType, effectType: EffectType, next: VisualNext): Visual<'update'> => {
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

    // const getEffect = (effect: EffectType): VisualConfig => effects[effect];

    return {
        getVisual,
        getDraw,
        // getEffect,
    };
};
