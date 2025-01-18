import type {
    AddNativeListener,
    EventHandler,
    EntityListenerHandler,
    NativeListenerMap,
    RemoveNativeListener,
} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';

export const createEventHandler = <K extends keyof HTMLElementEventMap>(
    input: LibraryInput,
    listeners?: Partial<NativeListenerMap<K>>,
) => {
    const listenerHandlers: {[type: string]: EntityListenerHandler} = {};

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

const createAddAndRemoveNativeListener: (
    listenerHandlers: {[type: string]: EntityListenerHandler},
    input: LibraryInput,
) => {
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
} = (listenerHandlers, input) => ({
    addNativeListener: (type, listener, activate = true) => {
        // if (!listenerHandlers[type]) ...

        const id = Symbol();

        listenerHandlers[type] = [
            id,
            () => input.addListener({type, listener, id}),
            () => input.removeListener(type, id),
        ];

        if (activate) input.addListener({type, listener, id});

        return id;
    },
    removeNativeListener: (type: keyof HTMLElementEventMap) => {
        const handler = listenerHandlers[type];

        if (handler) {
            input.removeListener(type, handler[0]); // type + id

            delete listenerHandlers[type];

            return;
        }

        // TODO::Throw Library Error
    },
});

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

// TODO::Extract Shape from sketch (pass only needed props)
// if (sketch.type === 'rect' || sketch.type === 'circle') {
// input.addListener(type, runListener, props);
// }
