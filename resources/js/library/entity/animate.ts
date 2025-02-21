// import {createRenders} from './renders';
import {createSketchDraw, getCreateVisual} from './visuals';
import type {Engine} from 'library/types/engine';
import type {LibraryInput} from 'library/types/input';
import type {
    EventHandler,
    GeneralProperties,
    // SetEngine,
    SetVisual,
    VisualProperties,
    Visuals,
} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';

export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    engine: Engine,
    context: CanvasRenderingContext2D,
    // eventHandler: EventHandler,
) => {
    const {animation, hover, start, end} = vProps;

    // const renders = createRenders(gProps, sketch, vProps, input, context);
    // const mixedRenders = {...renders.animations, ...renders.hovers, ...renders.transitions};
    // const createVisual = getCreateVisual(gProps, vProps, sketch, input, context);

    const visuals: Partial<Visuals> = {};
    const createVisual = getCreateVisual(sketch, input, vProps);

    const setVisual: SetVisual = (type, effect) =>
        (visuals[type] = {
            visual: {
                id: `${gProps.id}-${type}-${effect}`,
                name: `${type} ${effect}`,
                type: 'update',
                fn: createVisual[effect](),
            },
        });

    const setDraw = (sketch: EntitySketchMap['button1']) => {
        const draw = {
            type: 'draw',
            id: `${sketch.type}-draw`,
            name: `${sketch.type} Draw`,
            fn: createSketchDraw(context, sketch),
        };

        engine.setDraw(draw);
    };

    return {setVisual, setDraw};
};
