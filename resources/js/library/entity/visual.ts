import {createSketchDraw} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {
    EffectType,
    GeneralProperties,
    GetVisual,
    Visual,
    VisualCreation,
    VisualNext,
    VisualType,
} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';

export const setVisuals = (
    gProps: GeneralProperties,
    // vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
) => {
    const createVisual = <VT extends VisualType, ET extends EffectType>(visual: {
        visualType: VT;
        effectType: ET;
        get: (sketch: EntitySketchMap['button'], next: VisualNext, input: LibraryInput) => VisualCreation;
    }) => {
        let next = () => {
            if (visual.visualType === 'start') {
            }
            //
        };

        return visual.get(sketch, next, input);
    };

    // const createVisual = getCreateVisual(sketch, input, vProps);

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

    const getDraw = (sketch: EntitySketchMap['button']): Visual<'draw'> => {
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
