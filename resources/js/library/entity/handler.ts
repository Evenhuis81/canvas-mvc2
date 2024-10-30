/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {makeObjectValueMoverPartial} from 'library/helpers';
import {
    CustomEventMap,
    EntityConfigListeners,
    EntityEventMap,
    EntityTransitionEvent,
    EventHandler,
    ListenerHandler,
} from 'library/types/entity';
import {Input} from 'library/types/input';
import {s} from 'vite/dist/node/types.d-aGj9QkWt';

export const createEventHandler = <T extends keyof EntityEventMap>(
    input: Input,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler = {
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
        startTransitionEnd: (evt: EntityTransitionEvent) => {},
        endTransitionEnd: (evt: EntityTransitionEvent) => {},
    };

    const setListener = createSetListener(listenerHandlers, eventHandler, input);

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
    startTransitionEnd: {transitionProp: 'startEndProp'},
    endTransitionEnd: {transitionProp: 'endEndProp'},
};

const createSetListener =
    (listenerHandlers: ListenerHandler[], eventHandler: Omit<EventHandler, 'setListener'>, input: Input) =>
    <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
        const run = () => {
            listener(entityProps[type]);
        };

        if (type === 'endTransitionEnd') {
            // eventHandler.startTransitionEnd = run;

            return;
        } else if (type === 'startTransitionEnd') {
            // eventHandler.startTransitionEnd = run;

            return;
        }

        // if (type === 'mousedown') {
        //     const run = (evt: MouseEvent) => {
        //         //
        //         listener(entityProps[type]);
        //     };

        //     input.setInput(type, run);
        // }

        const add = () => {
            input.setInput(type, run);
            // canvas.addEventListener(type, nativeListener);
        };

        const remove = () => {
            // canvas.removeEventListener(type, nativeListener);
        };

        const index = listenerHandlers.findIndex(t => t.type === type);

        if (index === -1) {
            add();

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
