import type {EventHandler, ListenerHandler, NativeListenersConfig} from 'library/types/entity';
import {LibraryInput} from 'library/types/input';
import type {Shapes} from 'library/types/shapes';

export const createEventHandler = <K extends keyof HTMLElementEventMap>(
    input: LibraryInput,
    sketch: Shapes,
    listeners?: Partial<NativeListenersConfig<K>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    // const eventHandler: Omit<EventHandler, 'addListener' | 'removeListener'> = {
    const eventHandler: EventHandler = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove()),
    };

    // const listenerEvents = createListenerEvents();

    const {addNativeListener, removeNativeListener} = createAddAndRemoveNativeListener(
        listenerHandlers,
        eventHandler,
        // listenerEvents,
        input,
        sketch,
    );

    if (!listeners) return Object.assign(eventHandler, {addNativeListener, removeNativeListener});

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        addNativeListener(key, listener);
    }

    return Object.assign(eventHandler, {addNativeListener, removeNativeListener});
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

const createAddAndRemoveNativeListener = (
    listenerHandlers: ListenerHandler[],
    // eventHandler: Omit<EventHandler, 'addListener' | 'removeListener'>,
    eventHandler: EventHandler,
    // eventProperties: EntityEventMap,
    input: LibraryInput,
    sketch: Shapes,
) => {
    return {
        addNativeListener: <K extends keyof HTMLElementEventMap>(
            type: K,
            listener: (evt: HTMLElementEventMap[K]) => void,
        ) => {
            const add = () => {
                const inputListener = {
                    type,
                    listener,
                    id: Symbol(),
                };
                inputListener.id = input.addNativeListener(inputListener);
                // TODO::Extract Shape from sketch (pass only needed props)
                // if (sketch.type === 'rect' || sketch.type === 'circle') {

                // return;
                // }

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
        removeNativeListener: <K extends keyof EntityListenerEvents>(type: K) => {
            const index = listenerHandlers.findIndex(t => t.type === type);

            if (index === -1) throw Error(`${type} does not exist in handler`);

            listenerHandlers[index].remove();

            listenerHandlers.splice(index, 1);
        },
    };
};
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
