import {Engine} from 'library/types/engine';
import {EntityHandler, GeneralProperties, GetDraw, GetVisual, VisualProperties} from 'library/types/entity';

export default (
    gProps: GeneralProperties,
    vProps: Partial<VisualProperties>,
    {entityListeners, activateInputListeners, deactivateInputListeners}: EntityHandler,
    engine: Engine,
    getVisual: GetVisual,
    getDraw: GetDraw,
) => {
    // Pre-creation of visuals here for efficiency testing
    // Are startListener and endListener needed?
    // const visuals: Partial<Visual<'update' | 'draw'>> = {};

    const start = () => {
        if (!gProps.show) return;

        if (gProps.showDelay) {
            setTimeout(() => {
                const {render: renderDraw, pre: preDraw, post: postDraw} = getDraw();

                if (preDraw) preDraw();

                engine.handle(renderDraw);

                if (vProps.start) {
                    const next = () => {
                        if (postStart) postStart();

                        engine.handle(renderStart, false);

                        if (entityListeners.endOfStartTransition) entityListeners.endOfStartTransition(transitionEvent);

                        if (vProps.animation) {
                            const {
                                render: renderAnimation,
                                pre: preAnimation,
                                post: postAnimation,
                            } = getVisual('animation', vProps.animation, () => {});

                            if (preAnimation) preAnimation();

                            engine.handle(renderAnimation);

                            if (vProps.hover) {
                                const {
                                    render: renderHover,
                                    pre: preHover,
                                    post: postHover,
                                } = getVisual('hover', vProps.hover, () => {});

                                if (preHover) preHover();

                                engine.handle(renderHover);
                            }
                        }
                    };

                    const {
                        render: renderStart,
                        pre: preStart,
                        post: postStart,
                    } = getVisual('start', vProps.start, next);

                    if (preStart) preStart();

                    engine.handle(renderStart);

                    activateInputListeners();

                    if (entityListeners.startTransition) entityListeners.startTransition(transitionEvent); // obsolete?
                }
            }, gProps.showDelay);

            gProps.show = false;
            gProps.showDelay = 0;
        }
    };

    const end = () => {
        if (vProps.end) {
            const next = () => {
                if (postEnd) postEnd();

                engine.handle(renderEnd, false);

                // if (postDraw) postDraw();

                // engine.handle(renderDraw);

                if (entityListeners.endOfEndTransition) entityListeners.endOfEndTransition(transitionEvent);
            };

            const {render: renderEnd, pre: preEnd, post: postEnd} = getVisual('end', vProps.end, next);

            if (preEnd) preEnd();

            engine.handle(renderEnd);

            // setEngine('hover', 'off');
            // setEngine('animation', 'off');

            deactivateInputListeners();

            if (entityListeners.endTransition) entityListeners.endTransition(transitionEvent); // obsolete?
        }
    };

    // export type StartTransitionEvent = {testProperty: string};
    // export type EndTransitionEvent = {pressed: boolean; pushed: boolean; clicked: boolean};

    const transitionEvent = {
        pressed: false,
        pushed: false,
        clicked: false,
        start,
        end,
    };

    if (gProps.show) start();

    return {start, end};
};

// TODO::Sketch optional (duration only with phaser)
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
//         setEngine('end', 'on');
//         setEngine('hover', 'off');
//         setEngine('animation', 'off');
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
