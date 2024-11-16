/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import type {EntityConfigListeners, EntityEventMap, EventHandler, ListenerHandler} from 'library/types/entity';
import type {Shapes} from 'library/types/entityShapes';
import type {Input} from 'library/types/input';

export const createEventHandler = <T extends keyof EntityEventMap>(
    input: Input,
    sketch: Shapes,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler: Omit<EventHandler, 'addListener'> = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
    };

    const eventProperties = createEventProperties();

    const {addListener, removeListener} = createAddAndRemoveListener(
        listenerHandlers,
        eventHandler,
        eventProperties,
        input,
        sketch,
    );

    if (!listeners) return Object.assign(eventHandler, {addListener, removeListener});

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        addListener(key, listener);
    }

    return Object.assign(eventHandler, {addListener});
};

const createEventProperties = () => {
    const baseProperties = {clicked: false, clickTotal: 0};

    // const mouseProperties = {
    //     mouseProp: 'test mouse prop',
    // };
    const keyProperties = {
        keyProp: 'test mouse prop',
    };
    // const touchProperties = {
    //     touchProp: 'test mouse prop',
    // };
    // const startTransitionEndProperties = {
    //     startEndProp: 'test mouse prop',
    // };
    // const endTransitionEndProperties = {
    //     endEndProp: 'test mouse prop',
    // };

    return {
        mousedown: baseProperties,
        mousemove: baseProperties,
        mouseup: baseProperties,
        keydown: keyProperties,
        keyup: keyProperties,
        touchstart: baseProperties,
        touchmove: baseProperties,
        touchend: baseProperties,
        startTransitionEnd: baseProperties,
        endTransitionEnd: baseProperties,
    };
};

const createAddAndRemoveListener = (
    listenerHandlers: ListenerHandler[],
    eventHandler: Omit<EventHandler, 'addListener' | 'removeListener'>,
    eventProperties: EntityEventMap,
    input: Input,
    sketch: Shapes,
) => {
    return {
        addListener: <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
            const props = eventProperties[type];
            const runListener = () => listener(props);

            if (type === 'startTransitionEnd') {
                eventHandler.startTransitionEnd = runListener;

                return;
            }
            if (type === 'endTransitionEnd') {
                eventHandler.endTransitionEnd = runListener;

                return;
            }

            const add = () => {
                // TODO::Extract Shape from sketch (pass only needed props)
                if (sketch.type === 'rect' || sketch.type === 'circle')
                    input.addListener(type, runListener, props, sketch);

                input.addListener(type, runListener, props);
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
        },
        removeListener: <K extends keyof EntityEventMap>(type: K) => {
            const index = listenerHandlers.findIndex(t => t.type === type);

            if (index === -1) throw Error(`${type} does not exist in handler`);

            listenerHandlers[index].remove();

            listenerHandlers.splice(index, 1);
        },
    };
};
