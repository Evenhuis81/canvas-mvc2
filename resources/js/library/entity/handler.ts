import type {
    ActivateListener,
    AddNativeListener,
    DeactivateListener,
    EventHandler,
    NativeListenerMap,
} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';

export type ListenerHandler = {
    type: keyof HTMLElementEventMap;
    // id: symbol;
    activate: () => void;
    deactivate: () => void;
};

export const createEventHandler = <K extends keyof HTMLElementEventMap>(
    input: LibraryInput,
    listeners?: Partial<NativeListenerMap<K>>,
) => {
    const listenerHandlers: {[type: string]: [symbol, ActivateListener, DeactivateListener]} = {};
    // const listenerHandlers: {[K in keyof HTMLElementEventMap]?: [symbol, ActivateListener, DeactivateListener]} = {};
    // const listenersSet: Array<keyof HTMLElementEventMap> = [];

    const {addNativeListener, removeNativeListener} = createAddAndRemoveNativeListener(listenerHandlers, input);

    const eventHandler: EventHandler = {
        addNativeListener,
        removeNativeListener,
        activateNativeListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][1](); // deactivate function
        },
        deactivateNativeListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][2](); // activate function
        },
    };

    if (!listeners) return eventHandler;

    for (const type in listeners) {
        const listener = listeners[type];

        if (!listener) continue;

        addNativeListener(type, listener, false);
    }

    return eventHandler;
};

const createAddAndRemoveNativeListener = {
    AddNativeListener: (type, listener, activate = true) => {
        const id = Symbol();

        listenerHandlers[type] = [id, () => input.addListener({type, listener, id}), () => input.removeListener(id)];

        if (activate) input.addListener({type, listener, id});

        return id;
    },
    removeNativeListener: (type: keyof HTMLElementEventMap) => {
        const handler = listenerHandlers[type];

        if (handler) {
            input.removeListener(handler[0]);

            delete listenerHandlers[type];

            return;
        }

        // TODO::Throw Library Error
    },
};

// const mouseProps = {clicked: false, clickTotal: 0};
// const touchProps = {touched: false, touchTotal: 0};
// const keyProps = {keyProp: 'test key prop'};
// const startTransitionEndProps = {startEndProp: 'test startEnd prop'};
// const endTransitionEndProps = {endEndProp: 'test endEnd prop'};

// const createListenerEvents = () => ({
//     startTransitionEnd: {...startTransitionEndProps},
//     endTransitionEnd: {...endTransitionEndProps},
// });

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

// const runListener = () => listener(props);
// TODO::Extract Shape from sketch (pass only needed props)
// if (sketch.type === 'rect' || sketch.type === 'circle') {

// return;
// }

// input.addListener(type, runListener, props);
