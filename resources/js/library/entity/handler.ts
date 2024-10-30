/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {EntityConfigListeners, EntityEventMap} from 'library/types/entity';

export const createEventHandler = <T extends keyof EntityEventMap>(
    canvas: HTMLCanvasElement,
    input: Input,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];
    const setListener = createSetListener(canvas, listenerHandlers, input);

    if (!listeners) return;

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setListener(key, listener);
    }

    const addListeners = () => listenerHandlers.forEach(l => l.add());

    const removeListeners = () => listenerHandlers.forEach(l => l.remove);

    const startTransitionEnd = () => {};
    const endTransitionEnd = () => {};

    const makeKeyRemover =
        <Key extends string | number | symbol>(keys: Key[]) =>
        <Obj extends Record<Key, unknown>>(obj: Obj): Omit<Obj, Key> => {
            const result = {...obj};
            keys.forEach(key => {
                if (key in obj) {
                    // Check if key is present in Obj
                    delete result[key]; // If yes, delete key
                }
            });

            return result;
        };

    const keyR = makeKeyRemover(['startTransitionEnd', 'endTransitionEnd']);

    const newListeners = keyR(listeners);

    return {setListener, addListeners, removeListeners, startTransitionEnd, endTransitionEnd};
};

const mouseProp = {mouseProp: 'undefined'};

const entityProps = {
    keyup: {keyProp: 'testString keyprop'},
    mouseup: mouseProp,
    startTransitionEnd: {startTransitionEndProp: 'startTransitionEndProp'},
    endTransitionEnd: {endTransitionEndProp: 'endTransitionEndProp'},
};

type ListenerHandler = {type: keyof EntityEventMap; add: () => void; remove: () => void};

const createSetListener =
    (canvas: HTMLCanvasElement, listenerHandlers: ListenerHandler[], input: Input) =>
    <K extends keyof EntityEventMap>(type: K, listener: (evt: EntityEventMap[K]) => void) => {
        const run = () => listener(entityProps[type]);

        if (type === 'startTransitionEnd') {
            //
        }
        if (type === 'endTransitionEnd') {
            //
        }

        // switch (type) {
        //     case 'startTransitionEnd':
        //         // startTransitionEnd = listener;
        //         break;
        //     case 'endTransitionEnd':
        //         // endTransitionEnd = listener;
        //         break;
        //     // case 'keyup':
        //     //     //
        //     //     break;
        //     // case 'mouseup':
        //     //     //
        //     //     break;
        //     default:
        console.log(type);
        input.setInput(type, run);
        //         break;
        // }

        // canvas.addEventListener(type, listener);
        // }
        // const nativeListener = () => {
        //     listener(entityProps[type]);
        // };

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
