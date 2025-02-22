import {createSketchDraw, getCreateVisual} from './visuals';
import type {LibraryInput} from 'library/types/input';
import type {GeneralProperties, SetDraw, SetVisual, VisualProperties, Visuals} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';
import {Callbacks} from './callback';

export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    context: CanvasRenderingContext2D,
    visuals: Partial<Visuals>,
    callbacks: Callbacks,
) => {
    const createVisual = getCreateVisual(sketch, input, vProps, callbacks);

    const {animation, hover, start, end} = vProps;

    const setVisual: SetVisual = (type, effect) => {
        const {render, pre, post, callback} = createVisual[effect]();

        visuals[type] = {
            render: {
                type: 'update',
                id: `${gProps.id}-${type}-${effect}`,
                name: `${type} ${effect}`,
                fn: render,
            },
            pre,
            post,
            callback,
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
            // callback,
        };

        visuals.draw = visual;

        if (animation) setVisual('animation', animation);
        if (hover) setVisual('hover', hover);
        if (start) setVisual('start', start);
        if (end) setVisual('end', end);
    };

    setDraw(sketch);

    return {setVisual, setDraw};
};
