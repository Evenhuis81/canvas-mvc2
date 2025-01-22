import type {
    EventHandler,
    EntityListenerHandler,
    AddListener,
    RemoveListener,
    EntityListenerMap,
    EntityListenerEventMap,
    // EntityListenerType,
} from 'library/types/entity';
import type {LibraryInput} from 'library/types/input';
import type {Shape} from 'library/types/shapes';

export const createEventHandler = <K extends keyof EntityListenerEventMap>(
    input: LibraryInput,
    sketch: Shape,
    listeners?: Partial<EntityListenerMap<K>>,
) => {
    if (listeners) {
        // const {startTransitionEnd, ...native} = listeners;

        if (listeners.startTransitionEnd)


        // native.mousedown
        //
    }

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

        console.log('adding listener first time from handler creation');
        addListener(type, listener, false);
    }

    return eventHandler;
};

const type1And2 = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};

const {x, y, ...type2} = type1And2;

const createAddAndRemoveListener: (
    listenerHandlers: {[type: string]: EntityListenerHandler},
    input: LibraryInput,
    sketch: Shape,
) => {
    addListener: AddListener;
    removeListener: RemoveListener;
} = (listenerHandlers, input, sketch) => ({
    addListener: (type, listener, activate = true) => {
        const id = Symbol();

        const activateInput = () => {
            // TODO::Add to Error/Log Handling module
            if (listenerHandlers[type][3]) return console.log('input is already active');

            console.log('activate input');

            listenerHandlers[type][3] = true;

            return input.addListener({type, listener, id, shape: sketch});
        };

        const deactivateInput = () => input.removeListener(type, id);

        listenerHandlers[type] = [id, activateInput, deactivateInput, false];

        if (activate) {
            console.log('activate?');

            activateInput();
        }

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
// if (type === 'endTransitionEnd') {

// TODO::Extract Shape from sketch (pass only needed props)
// if (sketch.type === 'rect' || sketch.type === 'circle')
// input.addListener(type, runListener, props);
