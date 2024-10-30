/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
// import {makeObjectValueMoverPartial} from 'library/helpers';
import type {EntityConfigListeners, EntityEventMap, EventHandler, ListenerHandler, Sketch} from 'library/types/entity';
import type {Input} from 'library/types/input';

export const createEventHandler = <T extends keyof EntityEventMap>(
    input: Input,
    sketch: Sketch,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler: Omit<EventHandler, 'setListener'> = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
    };

    const setListener = createSetListener(listenerHandlers, eventHandler, input, sketch);

    if (!listeners) return {...eventHandler, setListener};

    // const objectValueMover = makeObjectValueMoverPartial(['startTransitionEnd', 'endTransitionEnd']);

    // const {result, copied} = objectValueMover(listeners);

    // copied.forEach(copy => eventHandler[copy.type] = copy.value);

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setListener(key, listener);
    }

    return {
        ...eventHandler,
        setListener,
    };
};

const entityProps = {
    mousedown: {mouseProp: 'asdf'},
    mousemove: {mouseProp: 'asdf'},
    mouseup: {mouseProp: 'asdf'},
    keydown: {keyProp: 'asdf'},
    keyup: {keyProp: 'asdf'},
    touchstart: {touchProp: 'asdf'},
    touchmove: {touchProp: 'asdf'},
    touchend: {touchProp: 'asdf'},
    startTransitionEnd: {startTransitionProp: 'startEndProp'},
    endTransitionEnd: {endTransitionProp: 'endEndProp'},
};

const createSetListener =
    (
        listenerHandlers: ListenerHandler[],
        eventHandler: Omit<EventHandler, 'setListener'>,
        input: Input,
        sketch: Sketch,
    ) =>
    <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
        const runListener = () => listener(entityProps[type]);

        if (type === 'startTransitionEnd') {
            eventHandler.startTransitionEnd = runListener;

            return;
        } else if (type === 'endTransitionEnd') {
            eventHandler.endTransitionEnd = runListener;

            return;
        }

        const add = () => {
            input.addListener(type, runListener, sketch);
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

        add();
    };

// const mouseupListener = (evt: MouseEvent) => {
//     // statistic release counter (inside or outside), can be used to check clicked (to remove clicked property)
//     if (mouse.insideRect(sketch)) {
//         properties.clicked = true;

//         mouseup({clicked: properties.clicked, evt});

//         // See below comments, until done, choose mouse or touch to call usermethod
//         userListeners.clickup({clicked: properties.clicked, evt});
//     }
// };
