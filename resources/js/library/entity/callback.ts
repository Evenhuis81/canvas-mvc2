import {EventHandler, SetEngine} from 'library/types/entity';

export type Callbacks = ReturnType<typeof createCallbacks>;

export const createCallbacks = (
    setEngine: SetEngine,
    {
        entityListenerEvents: {startTransition: startEvent, endTransition: endEvent},
        entityListeners: {startTransition, endOfStartTransition, endTransition, endOfEndTransition},
    }: EventHandler,
) => ({
    start: () => {
        console.log('start setEngine');

        setEngine('draw', 'on');
        setEngine('start', 'on');

        if (startTransition) startTransition(startEvent);
    },
    endOfStart: () => {
        console.log('endOfStart setEngine');

        setEngine('start', 'off');
        setEngine('animation', 'on');
        setEngine('hover', 'on');

        if (endOfStartTransition) endOfStartTransition(startEvent);
    },
    end: () => {
        console.log('end setEngine');

        setEngine('end', 'on');
        setEngine('hover', 'off');
        setEngine('animation', 'off');

        if (endTransition) endTransition(endEvent);
    },
    endOfEnd: () => {
        console.log('endOfEnd setEngine');

        setEngine('end', 'off');
        setEngine('animation', 'off');
        setEngine('hover', 'off');

        if (endOfEndTransition) endOfEndTransition(endEvent);
    },
});
