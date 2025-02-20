import {createRenders} from './renders';
import type {Engine} from 'library/types/engine';
import type {LibraryInput} from 'library/types/input';
import type {
    EventHandler,
    GeneralProperties,
    SetEngine,
    SetVisual,
    VisualProperties,
    Visuals,
} from 'library/types/entity';
import {EntitySketchMap} from 'library/types/entitySketch';

// export const setVisuals = <T extends keyof EntityShapeMap>(
export const setVisuals = (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    // sketch: EntitySketchMap[T],
    sketch: EntitySketchMap['button1'],
    input: LibraryInput,
    engine: Engine,
    context: CanvasRenderingContext2D,
    // eventHandler: EventHandler,
) => {
    const {animation, hover, start, end} = vProps;

    const renders = createRenders(gProps, sketch, vProps, input, context);

    const startT = start ? renders.transitions[start]() : undefined;

    // console.log(startT);
    startT?.update.callback();

    const visuals: Partial<Visuals> = {
        animation: animation ? renders.animations[animation]() : undefined,
        hover: hover ? renders.hovers[hover]() : undefined,
        // start: start ?  : undefined,
        start: startT,
        end: end ? renders.transitions[end]() : undefined,
        draw: renders.draw ?? undefined,
    };

    const mixedRenders = {...renders.animations, ...renders.hovers, ...renders.transitions};

    const setVisual: SetVisual = (kind, type) => (visuals[kind] = mixedRenders[type]());

    const setEngine = createSetEngine(engine, visuals);

    // transforms empty callbacks to functional callbacks, abstract and implement in eventHandler
    // const callbacks = createCallbacks(setEngine, eventHandler);

    return {setVisual};
};

const createCallbacks = (
    setEngine: SetEngine,
    {
        entityListenerEvents: {startTransition: startEvent, endTransition: endEvent},
        entityListeners: {startTransition, endOfStartTransition, endTransition, endOfEndTransition},
    }: EventHandler,
) => ({
    start: {
        fn: () => {
            console.log('start setEngine');

            setEngine('draw', 'on');
            setEngine('start', 'on');

            if (startTransition) startTransition(startEvent);
        },
        empty: false,
    },
    endOfStart: {
        fn: () => {
            console.log('endOfStart setEngine');

            setEngine('start', 'off');
            setEngine('animation', 'on');
            setEngine('hover', 'on');

            if (endOfStartTransition) endOfStartTransition(startEvent);
        },
        empty: false,
    },
    end: {
        fn: () => {
            console.log('end setEngine');

            setEngine('end', 'on');
            setEngine('hover', 'off');
            setEngine('animation', 'off');

            if (endTransition) endTransition(endEvent);
        },
        empty: false,
    },
    endOfEnd: {
        fn: () => {
            console.log('endOfEnd setEngine');

            setEngine('end', 'off');
            setEngine('animation', 'off');
            setEngine('hover', 'off');

            if (endOfEndTransition) endOfEndTransition(endEvent);
        },
        empty: false,
    },
});
