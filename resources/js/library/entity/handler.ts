import {BaseID} from 'library/types';
import type {EventHandler, NativeListenersConfig} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {Shapes} from 'library/types/shapes';

type ListenerHandler = {id: symbol; add: () => void; remove: () => void};

export const createEventHandler = <K extends keyof HTMLElementEventMap>(
    input: LibraryInput,
    sketch: Shapes,
    listeners?: Partial<NativeListenersConfig<K>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler: EventHandler = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove()),
    };

    const {addNativeListener, removeNativeListener} = createAddAndRemoveNativeListener(
        listenerHandlers,
        eventHandler,
        input,
        // sketch,
    );

    if (!listeners) return Object.assign(eventHandler, {addNativeListener, removeNativeListener});

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        addNativeListener(key, listener);
    }

    return Object.assign(eventHandler, {addNativeListener, removeNativeListener});
};

const createAddAndRemoveNativeListener = (
    listenerHandlers: ListenerHandler[],
    eventHandler: EventHandler,
    input: LibraryInput,
    // sketch: Shapes,
) => {
    return {
        addNativeListener: <K extends keyof HTMLElementEventMap>(
            type: K,
            listener: (evt: HTMLElementEventMap[K]) => void,
        ) => {
            const inputListener = {
                type,
                listener,
                id: Symbol(),
            };

            const add = () => {
                input.addListener(inputListener);
            };

            const remove = () => {
                const response = input.removeListener(inputListener.id);

                if (!response) {
                    // TODO::Create error handling that can use of symbol id
                    console.log(`listener with id ${String(inputListener.id)} failed`);

                    return false;
                }

                return true;
            };

            const index = listenerHandlers.findIndex(l => l.id === inputListener.id);

            if (index === -1) {
                listenerHandlers.push({id: inputListener.id, add, remove});

                return;
            }
        },
        removeNativeListener: (id: symbol) => {
            const index = listenerHandlers.findIndex(l => l.id === id);

            if (index === -1) {
                // TODO::Add to Error Handling module
                console.log(`${String(id)} does not exist in handler`);

                return false;
            }

            listenerHandlers[index].remove();

            listenerHandlers.splice(index, 1);

            return true;
        },
    };
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
