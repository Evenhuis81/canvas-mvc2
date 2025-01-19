import type {EventHandler, EntityListenerHandler, AddListener, RemoveListener, ListenerMap} from 'library/types/entity';
import type {InputListenerType, LibraryInput} from 'library/types/input';
import {Shapes} from 'library/types/shapes';

export const createEventHandler = <K extends InputListenerType>(
    input: LibraryInput,
    sketch: Shapes,
    listeners?: Partial<ListenerMap<K>>,
) => {
    const listenerHandlers: {[type: string]: EntityListenerHandler} = {};

    const {addListener, removeListener} = createAddAndRemoveListener(listenerHandlers, input, sketch);

    const eventHandler: EventHandler = {
        addListener,
        removeListener,
        activateListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][1](); // deactivate function
        },
        deactivateListeners: () => {
            for (const type in listenerHandlers) listenerHandlers[type][2](); // activate function
        },
    };

    if (!listeners) return eventHandler;

    for (const type in listeners) {
        const listener = listeners[type];

        if (!listener) continue;

        addListener(type, listener, false);
    }

    return eventHandler;
};

const createAddAndRemoveListener: (
    listenerHandlers: {[type: string]: EntityListenerHandler},
    input: LibraryInput,
    sketch: Shapes,
) => {
    addListener: AddListener;
    removeListener: RemoveListener;
} = (listenerHandlers, input, sketch) => ({
    addListener: (type, listener, activate = true) => {
        // if (!listenerHandlers[type]) ...

        const id = Symbol();

        const activateInput = () => {
            console.log('activate input');

            return input.addListener({type, listener, id, shape: sketch});
        };
        const deactivateInput = () => input.removeListener(type, id);

        listenerHandlers[type] = [id, activateInput, deactivateInput];

        if (activate) activateInput();

        return id;
    },
    removeListener: type => {
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
