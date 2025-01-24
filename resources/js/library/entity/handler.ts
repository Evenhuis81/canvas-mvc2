/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddEntityListener,
    AddNativeListener,
    EndEndTransitionEvent,
    EntityConfig,
    EntityListenerEventMap,
    EntityListenerHandler,
    EntityListenerMap,
    EventHandler,
    InputListenerHandler,
    RemoveEntityListener,
    RemoveNativeListener,
    StartEndTransitionEvent,
} from 'library/types/entity';
import type {InputListenerMap, InputListenerType, LibraryInput} from 'library/types/input';

export const createEventHandler = (
    input: LibraryInput,
    sketch: Shape,
    listeners: EntityConfig['listeners'],
): EventHandler => {
    const inputListenerHandlers: {[type: string]: InputListenerHandler} = {};
    const entityListeners: {[type: string]: EntityListeners} = {};

    const {addListener, removeListener, addNativeListener, removeNativeListener} = createAddAndRemove(
        inputListenerHandlers,
        entityListeners,
        sketch,
        input,
    );

    const eventHandler: EventHandler = {
        addListener,
        removeListener: () => {},
        addNativeListener,
        removeNativeListener,
        activateNativeListeners: () => {
            for (const type in inputListenerHandlers) inputListenerHandlers[type][1](); // deactivate method
        },
        deactivateNativeListeners: () => {
            for (const type in inputListenerHandlers) inputListenerHandlers[type][2](); // activate method
        },
        startTransitionEnd: () => {},
        endTransitionEnd: () => {},
    };

    if (!listeners) return eventHandler;

    const {startTransitionEnd, endTransitionEnd, nativeListeners} = getNativeAndEntityListeners(listeners);

    setNativeListeners(nativeListeners, addNativeListener);

    setEntityListeners(entityListeners, startTransitionEnd, endTransitionEnd);

    return eventHandler;
};

const getNativeAndEntityListeners = ({
    startTransitionEnd,
    endTransitionEnd,
    ...nativeListeners
}: Partial<EntityListenerMap<keyof EntityListenerEventMap>>) => ({
    startTransitionEnd,
    endTransitionEnd,
    nativeListeners,
});

const setEntityListeners = (
    entityListeners: {[type: string]: EntityListenerHandler},
    startTransitionEnd: (evt: StartEndTransitionEvent) => void,
    endTransitionEnd: (evt: EndEndTransitionEvent) => void,
) => {
    const {startEndEvent, endEndEvent} = createEntityListenerEvents();

    if (startTransitionEnd) entityListeners.startTransitionEnd = startTransitionEnd;
    entityListeners.startTransitionEnd = () => {
        startTransitionEnd(startEndEvent);
    };
    eventHandler.endTransitionEnd = () => {
        if (endTransitionEnd) endTransitionEnd(endEndEvent);
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

const createAddAndRemove: (
    inputListenerHandlers: {[type: string]: InputListenerHandler},
    entityListenerHandlers: {[type: string]: EntityListenerHandler},
    sketch: Shape,
    input: LibraryInput,
) => {
    addListener: AddEntityListener;
    removeListener: RemoveEntityListener;
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
} = (inputListenerHandlers, entityListenerHandlers, sketch, input) => ({
    addListener: <K extends keyof EntityListenerEventMap>(
        type: K,
        listener: (evt: EntityListenerEventMap[K]) => void,
    ) => {
        const ll: Partial<EntityListenerMap<K>> = {};

        ll[type] = listener;

        addEntityListeners(ll, eventHandler);
    },
    removeListener: () => {},
    addNativeListener: (type, listener, activate = true) => {
        const id = Symbol();

        inputListenerHandlers[type] = [
            id,
            () => input.addListener({type, listener, id, shape: sketch}),
            () => input.removeListener(type, id),
            activate,
        ];

        if (activate) input.addListener({type, listener, id, shape: sketch});

        return id;
    },
    removeNativeListener: type => {
        const handler = inputListenerHandlers[type];

        if (handler) {
            input.removeListener(type, handler[0]); // type + id

            delete inputListenerHandlers[type];
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
