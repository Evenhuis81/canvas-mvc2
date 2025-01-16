import type {EventHandler, NativeListenersConfig} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';

type ListenerHandler = {id: symbol; add: () => void; remove: () => void};

export const createEventHandler = <K extends keyof HTMLElementEventMap>(
    input: LibraryInput,
    listeners?: Partial<NativeListenersConfig<K>>,
) => {
    const eventHandlerListeners: ListenerHandler[] = [];

    const {add, remove} = createAddAndRemoveNativeListener(input);

    const eventHandler: EventHandler = {
        addListeners: () => eventHandlerListeners.forEach(l => l.add()),
        removeListeners: () => eventHandlerListeners.forEach(l => l.remove()),
    };

    if (!listeners) return eventHandler;

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        // Creation of Entity with listeners will get id auto-assigned (?)
        const newID = add(key, listener);
    }

    return Object.assign(eventHandler, {addNativeListener});
};

const createAddAndRemoveNativeListener = (input: LibraryInput) => {
    const add = <K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (evt: HTMLElementEventMap[K]) => void,
        id?: symbol,
    ) => {
        const listenerID = id ?? Symbol();

        input.addListener({type, listener, id: listenerID});

        if (!id) return listenerID;

        return;
    };

    const remove = (id: symbol) => {
        const response = input.removeListener(id);

        if (!response) {
            // TODO::Create error handling with use of symbol id
            console.log(`listener with id ${String(id)} failed`);

            return false;
        }

        return true;
    };

    return {add, remove};
};

//     const index = listenerHandlers.findIndex(l => l.id === inputListener.id);

//     input.addListener(inputListener);

//     if (index === -1) {
//         listenerHandlers.push({id: inputListener.id, remove});

//         return;
//     }
// }

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
