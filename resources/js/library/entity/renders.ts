import type {Colors} from 'library/types/color';
import type {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';
import type {LibraryInput} from 'library/types/input';

export const createRenders = (
    props: GeneralProperties,
    sketch: EntitySketchMap['button1'],

    input: LibraryInput,
    context: CanvasRenderingContext2D,
    // eventHandler: EventHandler,
) => {
    // export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;
    // export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
    // const setEngine = createSetEngine(engine, visuals);

    // transforms empty callbacks to functional callbacks, abstract and implement in eventHandler
    // const callbacks = createCallbacks(setEngine, eventHandler);

    // const {id, name} = props;

    // const draw = createDraw(context, sketch);

    const transitions = {
        fadeout1: () => {
            const {update: fn, prepare, callback} = createTransitionFadeout1(sketch.color, 0.005 * endSpeed);

            return {
                update: {
                    id: `${id}-fadeout1`,
                    name: `transition-fadeout1${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
        explode: () => {
            const {update: fn, prepare, callback} = createTransitionExplode(sketch, sketch.color);

            return {
                update: {
                    id: `${id}-slideinleft`,
                    name: `transition-slideinleft-${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
    };
    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number) => {
    const callback = () => {
        console.log('callback fadeout1');
    };

    const update = () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) end();
    };

    const prepare = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    };

    const end = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;

        // console.log('endOFEnd');
        // callbacks.endOfEnd.fn();
        callback();
    };

    return {update, prepare, end, callback};
};

let phase = 1;

const createTransitionExplode = (sketch: EntitySketchMap['button1'], {fill, stroke, textFill}: Colors) => {
    const callback = () => {
        console.log('callback explode');
    };

    const update = () => {
        if (phase === 1) sketch.lineWidth += 0.1;
        else if (phase === 2) {
            fill.a -= 0.01;
            stroke.a -= 0.01;
            textFill.a -= 0.01;

            if (fill.a < 0) {
                fill.a -= 0;
                stroke.a -= 0;
                textFill.a -= 0;

                // callbacks.endOfEnd.fn();
                callback();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    };

    // Figure out what this one does
    const end = () => {};

    const prepare = () => {};

    return {update, prepare, end, callback};
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

// const upd = {
//     origin: {
//         lw: 0,
//     },
//     range: {
//         lw: 1,
//     },
//     vel: {
//         x: 0,
//         y: 0,
//     },
//     adj: {
//         x: 0.5,
//         y: 0.5,
//     },
//     count: 0,
//     lw: 0,
//     max: 60,
//     angle: 0,
// };
