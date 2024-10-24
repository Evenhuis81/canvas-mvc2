import {ConfigOptions, EntityEventListener, NativeEventListeners, SetUserListener} from 'library/types/entity';

export const createHandler = (canvas: HTMLCanvasElement, listeners?: ConfigOptions['listeners']) => {
    if (!listeners) return;

    const {nativeListeners, setListener} = createNativeListeners(canvas, listeners);

    const addListeners = () =>
        nativeListeners.forEach(listener => canvas.addEventListener(listener.type, listener.listener));
    const removeListeners = () =>
        nativeListeners.forEach(listener => canvas.removeEventListener(listener.type, listener.listener));

    // temp return (not a real handler, missing callbacks and custom listeners)
    return {addListeners, removeListeners, setListener, nativeListeners};
};

const createNativeListeners = <T extends keyof HTMLElementEventMap>(
    canvas: HTMLCanvasElement,
    listeners: Partial<NativeEventListeners<T>>,
) => {
    const nativeListeners: EntityEventListener[] = [];

    // TODO::Convert this to a mixed custom & native event listener type
    const setListener = <Key extends keyof HTMLElementEventMap>(
        type: Key,
        listener: (evt: HTMLElementEventMap[Key]) => void,
    ) => {
        const index = nativeListeners.findIndex(l => l.type === type);

        if (index === -1) {
            nativeListeners.push({type, listener});

            canvas.addEventListener(type, listener);

            return;
        }

        // TODO::Test if overwritten listener gets handled properly
        canvas.removeEventListener(nativeListeners[index].type, nativeListeners[index].listener);

        nativeListeners[index] = {type, listener};

        canvas.addEventListener(type, listener);
    };

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        setListener(key, listener);
    }

    return {nativeListeners, setListener};
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
