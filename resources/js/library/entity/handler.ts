/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddNativeListener,
    EntityConfig,
    EntityListenerEventMap,
    // EntityListenerEventMap,
    EntityListenerHandler,
    // EntityListenerMap,
    EventHandler,
    RemoveNativeListener,
} from 'library/types/entity';
import type {InputListenerMap, InputListenerType, LibraryInput} from 'library/types/input';

export const createEventHandler = (
    input: LibraryInput,
    sketch: Shape,
    listeners: EntityConfig['listeners'],
): EventHandler => {
    // if (!listeners) return;

    const listenerHandlers: {[type: string]: EntityListenerHandler} = {};

    const {addNativeListener, removeNativeListener} = createAddAndRemoveNativeListener(listenerHandlers, sketch, input);

    const {startEndEvent, endEndEvent} = createEntityListenerEvents();

    // generic type in order to use with different objects then UserEvents only
    // type KeyWithCallback<A extends object> = {
    //     [K in keyof A]: [K, (evt: A[K]) => void]
    // }[keyof A];

    // ...args: KeyWithCallback<EntityListenerEventMap>
    const addListener = (
        type: keyof EntityListenerEventMap,
        listener: (evt: EntityListenerEventMap[keyof EntityListenerEventMap]) => void,
    ) => {
        // const ll: EntityConfig['listeners'] = {};

        // if (args[0] === 'startTransitionEnd') return;
        // if (args[0] === 'endTransitionEnd') return;
        if (type === 'startTransitionEnd') return;
        if (type === 'endTransitionEnd') return;

        // ll[type] = listener;

        addNativeListener(type, listener);

        // createEventHandler(input, sketch, ll);
    };

    const eventHandler: EventHandler = {
        addListener,
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

    const {startTransitionEnd, endTransitionEnd, ...native} = listeners;

    setNativeListeners(native, addNativeListener);

    eventHandler.startTransitionEnd = () => {
        if (startTransitionEnd) startTransitionEnd(startEndEvent);
    };
    eventHandler.endTransitionEnd = () => {
        if (endTransitionEnd) endTransitionEnd(endEndEvent);
    };

    return eventHandler;
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

// if (type === 'startTransitionEnd') {
//     eventHandler.startTransitionEnd = () => {
// props.

// console.log('startTransitionEnd event call');

// listener(props);
//     };

//     return;
// }
// if (type === 'endTransitionEnd') {
//     eventHandler.endTransitionEnd = () => ;

//     return;
// }

// TODO::Extract Shape from sketch (pass only needed props)
// if (sketch.type === 'rect' || sketch.type === 'circle') {
// input.addListener(type, runListener, props);
// }
