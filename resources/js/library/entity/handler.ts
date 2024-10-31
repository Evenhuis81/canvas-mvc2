/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
// import {makeObjectValueMoverPartial} from 'library/helpers';
import type {EntityConfigListeners, EntityEventMap, EventHandler, ListenerHandler, Sketch} from 'library/types/entity';
import type {Input} from 'library/types/input';

export const createEventHandler = <T extends keyof EntityEventMap>(
    input: Input,
    sketch: Sketch,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler: Omit<EventHandler, 'setListener'> = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
    };

    const eventProperties = createEventProperties();

    const setListener = createSetListener(listenerHandlers, eventHandler, eventProperties, input, sketch);

    if (!listeners) return Object.assign(eventHandler, {setListener});

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setListener(key, listener);
    }

    return Object.assign(eventHandler, {setListener});
};

const createEventProperties = () => {
    const mouseProperties = {
        mouseProp: 'test mouse prop',
    };
    const keyProperties = {
        keyProp: 'test mouse prop',
    };
    const touchProperties = {
        touchProp: 'test mouse prop',
    };
    const startTransitionEndProperties = {
        startEndProp: 'test mouse prop',
    };
    const endTransitionEndProperties = {
        endEndProp: 'test mouse prop',
    };
    const eventMap = {
        mousedown: mouseProperties,
        mousemove: mouseProperties,
        mouseup: mouseProperties,
        keydown: keyProperties,
        keyup: keyProperties,
        touchstart: touchProperties,
        touchmove: touchProperties,
        touchend: touchProperties,
        startTransitionEnd: startTransitionEndProperties,
        endTransitionEnd: endTransitionEndProperties,
    };

    return eventMap;
};

const createSetListener =
    (
        listenerHandlers: ListenerHandler[],
        eventHandler: Omit<EventHandler, 'setListener'>,
        eventProperties: EntityEventMap,
        input: Input,
        sketch: Sketch,
    ) =>
    <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
        const runListener = () => listener(eventProperties[type]);

        if (type === 'startTransitionEnd') {
            eventHandler.startTransitionEnd = runListener;

            return;
        }
        if (type === 'endTransitionEnd') {
            eventHandler.endTransitionEnd = runListener;

            // console.log(eventHandler);

            return;
        }

        const add = () => {
            // TODO::Extract Shape from sketch
            input.addListener(type, runListener, sketch, eventProperties[type]);
        };

        const remove = () => {
            input.removeListener(type);
        };

        const index = listenerHandlers.findIndex(t => t.type === type);

        if (index === -1) {
            listenerHandlers.push({type, add, remove});

            return;
        }

        listenerHandlers[index].remove();

        // TODO::Test if overwritten listener gets handled properly
        listenerHandlers[index] = {type, add, remove};
    };
