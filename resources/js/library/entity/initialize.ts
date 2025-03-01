import {Engine} from 'library/types/engine';
import {
    EntityHandler,
    GeneralProperties,
    GetDraw,
    GetVisual,
    Visual,
    VisualProperties,
    Visuals,
} from 'library/types/entity';

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
    const {animation, hover, start, end} = vProps;
    const visuals: Visuals = {
        draw: getDraw(),
    };

    const startShow = () => {
        if (!gProps.show) return;

        if (gProps.showDelay) {
            setTimeout(() => {
                // Test this with destructuring (change post before end is run, but after it's destructured)
                if (visuals.draw.pre) visuals.draw.pre();

                engine.handle(visuals.draw.render);

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
                            visuals.animation = {render: renderAnimation, pre: preAnimation, post: postAnimation};

                            if (preAnimation) preAnimation();

                            engine.handle(renderAnimation);

                            if (vProps.hover) {
                                const {
                                    render: renderHover,
                                    pre: preHover,
                                    post: postHover,
                                } = getVisual('hover', vProps.hover, () => {});
                                visuals.hover = {render: renderHover, pre: preHover, post: postHover};

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
                    visuals.start = {render: renderStart, pre: preStart, post: postStart};

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

    const endShow = () => {
        // if (ending) return;

        if (vProps.end) {
            const next = () => {
                if (postEnd) postEnd();

                engine.handle(renderEnd, false);

                if (visuals.draw.post) visuals.draw.post();

                engine.handle(visuals.draw.render);

                if (entityListeners.endOfEndTransition) entityListeners.endOfEndTransition(transitionEvent);
            };

            const {render: renderEnd, pre: preEnd, post: postEnd} = getVisual('end', vProps.end, next);
            visuals.end = {render: renderEnd, pre: preEnd, post: postEnd};

            if (preEnd) preEnd();

            engine.handle(renderEnd);

            if (visuals.hover) engine.handle(visuals.hover.render, false);
            if (visuals.animation) engine.handle(visuals.animation.render, false);

            deactivateInputListeners();

            if (entityListeners.endTransition) entityListeners.endTransition(transitionEvent); // obsolete?

            gProps.showDelay = 500;
            gProps.show = true;
        }
    };

    const transitionEvent = {
        pressed: false,
        pushed: false,
        clicked: false,
        start: startShow,
        end: endShow,
    };

    if (gProps.show) startShow();

    return {start: startShow, end: endShow};
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
