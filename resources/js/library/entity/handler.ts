/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {EntityConfigListeners, EntityEventMap} from 'library/types/entity';
import {Input} from 'library/types/input';

export const createEventHandler = (input: Input, listeners?: EntityConfigListeners<keyof EntityEventMap>) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler = {
        setListener: createSetListener(listenerHandlers, input),
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
        startTransitionEnd: () => {},
        endTransitionEnd: () => {},
    };

    if (!listeners) return eventHandler;

    const keyRemover = makeKeyRemover(['startTransitionEnd', 'endTransitionEnd']);

    const {result, copied} = keyRemover(listeners);

    // const {startTransitionEnd, endTransitionEnd} = listeners;
    // if (listeners.startTransitionEnd)

    // const keyR = makeKeyRemover(['startTransitionEnd', 'endTransitionEnd']);

    // const result = keyR(listeners);

    // const ttt = <K extends keyof Omit<EntityEventMap, 'startTransitionEnd' | 'endTransitionEnd'>>(
    //     listenerss?: Partial<EntityConfigListeners<K>>,
    // ) => {
    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        eventHandler.setListener(key, listener);
    }
    // };

    // ttt(newListeners);

    return eventHandler;
};

const makeKeyRemover =
    <Key extends string | number | symbol>(keys: Key[]) =>
    <Obj extends Record<Key, unknown>>(obj: Obj): {result: Omit<Obj, Key>; copied: {type: Key; value: Obj[Key]}[]} => {
        const result = {...obj};
        const copied: {type: Key; value: Obj[Key]}[] = [];
        keys.forEach(key => {
            if (key in obj) {
                copied.push({type: key, value: result[key]});
                delete result[key];
            }
        });

        return {result, copied};
    };

const entityProps = {
    mousedown: {mouProp: 'asdf'},
    mousemove: {mouProp: 'asdf'},
    mouseup: {mouProp: 'asdf'},
    keydown: {keyProp: 'asdf'},
    keyup: {keyProp: 'asdf'},
    touchstart: {touProp: 'asdf'},
    touchmove: {touProp: 'asdf'},
    touchend: {touProp: 'asdf'},
    startTransitionEnd: {startEndProp: 'startEndProp'},
    endTransitionEnd: {endEndProp: 'endEndProp'},
};

type ListenerHandler = {type: keyof EntityEventMap; add: () => void; remove: () => void};

const createSetListener =
    (listenerHandlers: ListenerHandler[], input: Input) =>
    <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
        const run = () => listener(entityProps[type]);

        if (type === 'endTransitionEnd' || type === 'startTransitionEnd') {
            //
        } else input.setInput(type, run);

        const add = () => {
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

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setEntityListener(key, listener);
    }
};

// const handler = {
//     callbacks: [],
//     listeners: [],
//     add: () => {},
//     remove: () => {},
//     addAll: () => {},
//     removeAll: () => {},
// }

// const addListeners = () =>
//     nativeListeners.forEach(listener => canvas.addEventListener(listener.type, listener.listener));
// const removeListeners = () =>
//     nativeListeners.forEach(listener => canvas.removeEventListener(listener.type, listener.listener));

// mousedown, mouseup, click (=mouseup/touchend), touchstart, touchend (native listeners)
// startTransitionEnd, endTransitionEnd -> custom listeners used for callbacks

// const createListenerMethods = () => {
// const mousedownListener = (evt: MouseEvent) => {
//     if (mouse.insideRect(sketch)) {
//         if (clickdown) clickdown({clicked: properties.clicked, evt});
//         if (mousedown) mousedown({clicked: properties.clicked, evt});
//     }
// };

// const mouseupListener = (evt: MouseEvent) => {
//     // statistic release counter (inside or outside), can be used to check clicked (to remove clicked property)
//     if (mouse.insideRect(sketch)) {
//         properties.clicked = true;

//         mouseup({clicked: properties.clicked, evt});

//         // See below comments, until done, choose mouse or touch to call usermethod
//         userListeners.clickup({clicked: properties.clicked, evt});
//     }
// };

// const err = {
//     clickdownconflict: () => {
//         throw Error('unable set mousedown or touchstart with clickdown');
//     },
//     clickupconflict: () => {
//         throw Error('unable to set mouseup or touchend with clickup');
//     },
// };

// const throwError = (type: keyof typeof err) => err[type];
