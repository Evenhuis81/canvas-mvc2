/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddListener,
    AddNativeListener,
    EntityConfig,
    EntityListenerEventMap,
    EntityListenerHandler,
    EntityListenerMap,
    EventHandler,
    RemoveListener,
    RemoveNativeListener,
} from 'library/types/entity';
import type {InputListenerMap, InputListenerType, LibraryInput} from 'library/types/input';

export const createEventHandler = (
    input: LibraryInput,
    sketch: Shape,
    listeners: EntityConfig['listeners'],
): EventHandler => {
    const listenerHandlers: {[type: string]: EntityListenerHandler} = {};

    const {addNativeListener, removeNativeListener} = createAddAndRemoveNativeListener(listenerHandlers, sketch, input);

    // ...args: KeyWithCallback<EntityListenerEventMap>
    const addListeners: (listeners: Partial<EntityListenerMap<keyof EntityListenerEventMap>>) => void = listteners => {
        if (type === 'startTransitionEnd') {
            // const prop = entityEvents['startTransitionEnd'];

            return (eventHandler.startTransitionEnd = () => listener(entityEvents[type]));

            // const ll: EntityConfig['listeners'] = {};
        }
        if (type === 'endTransitionEnd') return (eventHandler.endTransitionEnd = () => listener(endEndEvent));

        addNativeListener(type, listener, activate);

        return;
    };

    const addListener: AddListener = (type, listener, activate = true) => {
        addEntityListener(type, listener, true);
    };

    const removeListener: RemoveListener = type => {
        const handler = listenerHandlers[type];

        if (type === 'startTransitionEnd') return (eventHandler.startTransitionEnd = () => {});
        if (type === 'endTransitionEnd') return (eventHandler.endTransitionEnd = () => {});

        if (handler) {
            input.removeListener(type, handler[0]); // type + id

            delete listenerHandlers[type];
        }

        // TODO::Throw Library Error

        return;
    };

    const eventHandler: EventHandler = {
        addListener: addListener,
        removeListener: removeListener,
        addNativeListener,
        removeNativeListener,
        activateNativeListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][1](); // deactivate method
        },
        deactivateNativeListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][2](); // activate method
        },
        startTransitionEnd: () => {},
        endTransitionEnd: () => {},
    };

    if (!listeners) return eventHandler;

    return eventHandler;
};

const setEntityListeners = (
    listeners: EntityConfig['listeners'],
    addNativeListener: AddNativeListener,
    eventHandler: EventHandler,
) => {
    if (!listeners) return;

    const {startTransitionEnd, endTransitionEnd, ...native} = listeners;

    setNativeListeners(native, addNativeListener);

    const {startEndEvent, endEndEvent} = createEntityListenerEvents();

    if (startTransitionEnd)
        eventHandler.startTransitionEnd = () => {
            startTransitionEnd(startEndEvent);
        };
    if (endTransitionEnd)
        eventHandler.endTransitionEnd = () => {
            endTransitionEnd(endEndEvent);
        };
};

const setNativeListeners = <K extends InputListenerType>(
    native: Partial<InputListenerMap<K>>,
    addNativeListener: AddNativeListener,
) => {
    for (const type in native) {
        const listener = native[type];

        if (!listener) continue;

        addNativeListener(type, listener, false);
    }
};

const createAddAndRemoveNativeListener: (
    listenerHandlers: {[type: string]: EntityListenerHandler},
    sketch: Shape,
    input: LibraryInput,
) => {
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
} = (listenerHandlers, sketch, input) => ({
    addNativeListener: (type, listener, activate = true) => {
        const id = Symbol();

        listenerHandlers[type] = [
            id,
            () => input.addListener({type, listener, id, shape: sketch}),
            () => input.removeListener(type, id),
            activate,
        ];

        if (activate) input.addListener({type, listener, id, shape: sketch});

        return id;
    },
    removeNativeListener: type => {
        const handler = listenerHandlers[type];

        if (handler) {
            input.removeListener(type, handler[0]); // type + id

            delete listenerHandlers[type];
        }

        // TODO::Throw Library Error
    },
});

// const mouseProps = {clicked: false, clickTotal: 0};
// const touchProps = {touched: false, touchTotal: 0};
// const keyProps = {keyProp: 'test key prop'};
const startTransitionEndProps = {startEndProp: 'test startEnd prop'};
const endTransitionEndProps = {endEndProp: 'test endEnd prop'};

const createEntityListenerEvents = () => ({
    startEndEvent: {...startTransitionEndProps},
    endEndEvent: {...endTransitionEndProps},
});
