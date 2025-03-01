import {Engine} from 'library/types/engine';
import {
    EffectType,
    GeneralProperties,
    GetDraw,
    GetVisual,
    Visual,
    VisualConfig,
    VisualProperties,
} from 'library/types/entity';

export default (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    engine: Engine,
    getVisual: GetVisual,
    getEffect: (effect: EffectType) => VisualConfig,
    getDraw: GetDraw,
) => {
    const visuals: Partial<Visual<'update' | 'draw'>> = {};

    // Pre-creation of visuals here for efficiency testing
    const show = () => {
        if (!gProps.show) return;

        if (gProps.showDelay) {
            setTimeout(() => {
                if (vProps.start) {
                    // const {render, pre, post} = getVisual('start', vProps.start);
                    // if (pre) pre();
                    // engine.handle(render);
                }

                // if (visuals.draw) {

                // }
                // setEngine('draw', 'on');
                // setEngine('start', 'on');
                // if (entityListeners.startTransition) entityListeners.startTransition(entityListenerEvents.startTransition);
            }, gProps.showDelay);

            gProps.show = false;
            gProps.showDelay = 0;
        }
    };

    const hide = () => {};

    if (gProps.show) show();

    return {show, hide};
};

// TODOS::Sketch optional (duration only with phaser)
// const {animation, hover, start, end} = vProps;
// if (animation) setVisual('animation', animation);
// if (hover) setVisual('hover', hover);
// if (start) setVisual('start', start);
// if (end) setVisual('end', end);
// setDraw(sketch);

// const {setEngine, visuals} = createSetEngine(engine);
// const callbacks = createCallbacks(setEngine, eventHandler);

// const show = () => {
//     if (generalProperties.show) return console.log('show is already active');
//     generalProperties.show = true;
//     // callbacks.start();
// };

// const hide = () => {
//     if (!generalProperties.show) return console.log('hide is already active');
//     generalProperties.show = false;
//     // callbacks.end();
// };

// const setHideTime = (time: number) => (generalProperties.hideDelay = time);

// // TODO::This needs options (ie. run pre/post?, transitionSpeed, listener handling, etc...)
// const createSetEngine = (engine: Engine) => {
//     const setEngine = (type: VisualType, state: EngineState) => {
//         const visual = visuals[type];

//         if (!visual) return setEngineLog(type, state);

//         if (state === 'on' && visual.pre) visual.pre();

//         return engine.handle(visual.render, state === 'on');
//     };

//     return {setEngine, visuals};
// };

// const setEngineLog = (type: string, state: string) =>
//     console.log(`setEngine: ${type} is not set, state: ${state}`);

// TODO::Test destructuring of eventhandler for keep of reference and if start&endOfStart needs same event
// export const createCallbacks = (
//     setEngine: SetEngine,
//     {deactivateInputListeners, activateInputListeners}: EntityHandler,
// ): Callbacks => ({
//     start: () => {
//         console.log('start setEngine');

//         setEngine('draw', 'on');
//         setEngine('start', 'on');

//         // if (entityListeners.startTransition) entityListeners.startTransition(entityListenerEvents.startTransition);
//     },
//     endOfStart: () => {
//         console.log('endOfStart callback');

//         activateInputListeners();

//         setEngine('start', 'off');
//         setEngine('animation', 'on');
//         setEngine('hover', 'on');

//         // if (entityListeners.endOfStartTransition)
//         //     entityListeners.endOfStartTransition(entityListenerEvents.endOfStartTransition);
//     },
//     end: () => {
//         console.log('end setEngine');

//         deactivateInputListeners();

//         setEngine('end', 'on');
//         setEngine('hover', 'off');
//         setEngine('animation', 'off');

//         // if (entityListeners.endTransition) entityListeners.endTransition(entityListenerEvents.endTransition);
//     },
//     endOfEnd: () => {
//         console.log('endOfEnd setEngine');

//         setEngine('end', 'off');
//         setEngine('animation', 'off');
//         setEngine('hover', 'off');

//         // if (entityListeners.endOfEndTransition)
//         //     entityListeners.endOfEndTransition(entityListenerEvents.endOfEndTransition);
//     },
// });
