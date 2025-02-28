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
import type {EntitySketchMap} from 'library/types/entitySketch';

export const createVisual = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    // <VT extends VisualType, ET extends EffectType>
    const getVisual = (
        effectType: EffectType,
        // get: (sketch: EntitySketchMap['button'], next: VisualNext, input: LibraryInput) => VisualCreation,
        next: VisualNext,
    ): Visual<'update'> => {
        const {render, pre, post} = get(sketch, next, input);
        return {
            render: {
                type: 'update',
                id: `${gProps.id}-${visual.visualType}-${visual.effectType}`,
                name: `${visual.visualType} ${visual.effectType}`,
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

    const visuals: Partial<Visual> = {};

    const getEffect = (effect: EffectType): VisualConfig => effects[effect];

    return {
        getVisual,
        getDraw,
        getEffect,
    };
};
