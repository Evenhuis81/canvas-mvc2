import type {
    EntityListeners,
    EventHandler,
    ListenerHandler,
} from 'library/types/entity';
import {LibraryInput} from 'library/types/input';
import type {Shapes} from 'library/types/shapes';

export const createEventHandler = <K extends keyof EntityListeners>(
    input: LibraryInput,
    sketch: Shapes,
    listeners?: Partial<EntityListeners[K]>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler: Omit<EventHandler, 'addListener' | 'removeListener'> = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove()),
    };

    const listenerEvents = createListenerEvents();

    const {addListener, removeListener} = createAddAndRemoveListener(
        listenerHandlers,
        eventHandler,
        listenerEvents,
        input,
        sketch,
    );

    if (!listeners) return Object.assign(eventHandler, {addListener, removeListener});

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        addListener(key, listener);
    }

    return Object.assign(eventHandler, {addListener});
};

const mouseProps = {clicked: false, clickTotal: 0};
const touchProps = {touched: false, touchTotal: 0};
const keyProps = {keyProp: 'test key prop'};
const startTransitionEndProps = {startEndProp: 'test startEnd prop'};
const endTransitionEndProps = {endEndProp: 'test endEnd prop'};

const createListenerEvents = () => ({
    startTransitionEnd: {...startTransitionEndProps},
    endTransitionEnd: {...endTransitionEndProps},
});

const createAddAndRemoveListener = (
    listenerHandlers: ListenerHandler[],
    eventHandler: Omit<EventHandler, 'addListener' | 'removeListener'>,
    eventProperties: EntityListenerEvents,
    input: LibraryInput,
    sketch: Shapes,
) => {
    return {
        addListener: <K extends keyof EntityListenerEvents>(type: K, listener: (evt: EntityListenerEvents[K]) => void) => {
            // TODO::Add only non-native properties to this and leave native listeners alone and put them directly into the addListener method
            //
            const props = eventProperties[type];

            if (type === 'startTransitionEnd') {
                eventHandler.startTransitionEnd = () => {
                    // props.

                    // console.log('startTransitionEnd event call');

                    // listener(props);
                };

                return;
            }
            if (type === 'endTransitionEnd') {
                eventHandler.endTransitionEnd = () => ;

                return;
            }

            const runListener = () => listener(props);

            const add = () => {
                // TODO::Extract Shape from sketch (pass only needed props)
                if (sketch.type === 'rect' || sketch.type === 'circle') {
                    input.addListener(type, runListener, sketch);

                    return;
                }

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
        removeListener: <K extends keyof EntityListenerEvents>(type: K) => {
            const index = listenerHandlers.findIndex(t => t.type === type);

            if (index === -1) throw Error(`${type} does not exist in handler`);

            listenerHandlers[index].remove();

            listenerHandlers.splice(index, 1);
        },
    };
};
