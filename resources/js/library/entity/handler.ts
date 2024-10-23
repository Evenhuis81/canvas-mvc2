import {ConfigOptions, EntityEventListener, NativeEventListeners, SetUserListener} from 'library/types/entity';

const createNativeListeners = (listeners: Partial<NativeEventListeners<keyof HTMLElementEventMap>>) => {
    // const testNativeArray: {type: keyof HTMLElementEventMap, listener: (evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => void}[] = []
    const nativeListeners: EntityEventListener<keyof HTMLElementEventMap>[] = [];

    // const nativeListeners: EntityEventListener<keyof HTMLElementEventMap>[] = [];

    // TODO::Convert this to a mixed custom & native event listener type
    const setListener = <K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (evt: HTMLElementEventMap[K]) => void,
    ) => {
        const index = nativeListeners.findIndex(l => l.type === type);

        if (index === -1) {
            nativeListeners.push({type, listener});

            return;
        }

        // TODO::Test if overwritten listener gets handled properly
        nativeListeners[index] = {type, listener};
    };

    let key: keyof HTMLElementEventMap;
    for (key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setListener(key, listener);
        nativeListeners.push({type: key, listener});
    }

    return nativeListeners;
};

export const createHandler = (canvas: HTMLCanvasElement, listeners?: ConfigOptions['listeners']) => {
    if (!listeners) return;

    const nativeListeners = createNativeListeners(listeners);

    const addListeners = () =>
        nativeListeners.forEach(listener => canvas.addEventListener(listener.type, listener.listener));
    const removeListeners = () =>
        nativeListeners.forEach(listener => canvas.removeEventListener(listener.type, listener.listener));

    // const {addListeners, removeListeners} = createListenerMethods(listeners);
    // return {setListener, handler: listeners}; // temp return (not a real handler)
};

// const createListenerMethods = (listeners: EntityListener[]) => {
// mousedown, mouseup, click (=mouseup/touchend), touchstart, touchend (native listeners)
// startTransitionEnd, endTransitionEnd -> custom listeners used for callbacks

// addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K])

//     const nativeListeners: NativeListener[] = [];

//     const parseEntityListener: ParseEntityListener = entityListener => {
//         const {type, listener} = entityListener;

//         if (type === 'mousedown' || type === 'mouseup' || type === 'touchstart' || type === 'touchend') {
//             return {
//                 type,
//                 listener,
//             };
//         }

//         return;
//     };
// };

// const createNativeListeners = (listeners: EntityListener[]) => {

// }

// const createNativeListener = {
//     clickdown: (listeners) => {},
//     mousedown: (listener: EntityListener, sketch: Sketch, mouse: Input["mouse"], clickdown = false) => (evt: MouseEvent) => {
//         if (mouse.insideRect(sketch)) {
//             //         if (clickdown) clickdown({clicked: properties.clicked, evt});
//             //         if (mousedown) mousedown({clicked: properties.clicked, evt});
//             }
//     },
//     mouseup: () => {},
//     startTransitionEnd: () => {},
//     endTransitionEnd: () => {},
//     touchstart: () => {},
//     touchend: () => {},
//     clickup: () => {},
// };

export const createListenerMethods = () => {
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

    let enabled = false;
    const add = () => {
        if (enabled) return;

        enabled = true;

        // addListeners(listeners);
    };

    const remove = () => {
        if (!enabled) return;

        // removeListeners(listeners);

        enabled = false;
    };

    return {add, remove};
};

const emptyCallbacks = {
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
};

const err = {
    clickdownconflict: () => {
        throw Error('unable set mousedown or touchstart with clickdown');
    },
    clickupconflict: () => {
        throw Error('unable to set mouseup or touchend with clickup');
    },
};

const throwError = (type: keyof typeof err) => err[type];
