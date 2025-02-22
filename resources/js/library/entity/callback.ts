import {EventHandler, SetEngine, Callbacks} from 'library/types/entity';

// TODO::Test destructuring of eventhandler for keep of reference and if start&endOfStart needs same event
export const createCallbacks = (
    setEngine: SetEngine,
    {entityListeners, entityListenerEvents}: EventHandler,
): Callbacks => ({
    start: () => {
        console.log('start setEngine');

        setEngine('draw', 'on');
        setEngine('start', 'on');

        if (entityListeners.startTransition) entityListeners.startTransition(entityListenerEvents.startTransition);
    },
    endOfStart: () => {
        console.log('endOfStart setEngine');

        setEngine('start', 'off');
        setEngine('animation', 'on');
        setEngine('hover', 'on');

        if (entityListeners.endOfStartTransition)
            entityListeners.endOfStartTransition(entityListenerEvents.endOfStartTransition);
    },
    end: () => {
        console.log('end setEngine');

        setEngine('end', 'on');
        setEngine('hover', 'off');
        setEngine('animation', 'off');

        if (entityListeners.endTransition) entityListeners.endTransition(entityListenerEvents.endTransition);
    },
    endOfEnd: () => {
        console.log('endOfEnd setEngine');

        setEngine('end', 'off');
        setEngine('animation', 'off');
        setEngine('hover', 'off');

        if (entityListeners.endOfEndTransition)
            entityListeners.endOfEndTransition(entityListenerEvents.endOfEndTransition);
    },
});
