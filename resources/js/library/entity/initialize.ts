import {GeneralProperties} from 'library/types/entity';

export default (gProps: GeneralProperties) => {
    // show is used initially to show or hide when no showDelay is set. After it's used internally to indicate if entity is active
    const show = () => {
        if (!gProps.show) return;

        gProps.show = false;

        if (gProps.showDelay) {
            setTimeout(() => {
                setEngine('draw', 'on');
                setEngine('start', 'on');

                // if (entityListeners.startTransition) entityListeners.startTransition(entityListenerEvents.startTransition);
            }, gProps.showDelay);

            gProps.showDelay = 0;
        }
    };

    const hide = () => {
        //
    };

    if (gProps.show) show();

    return {show, hide};
};

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
