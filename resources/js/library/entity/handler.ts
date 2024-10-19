import type {
    EntityListener,
    ParseListenerOption,
    Sketch,
    ListenerOptions,
    ParseEntityListener,
    NativeListener,
    ListenerOptionsNative,
} from 'library/types/entity';

export const createHandler = (listeners: Partial<ListenerOptionsNative> = {}) => {
    const nativeListeners: ReturnType<ParseNativeListener>[] = [];

    type ParseNativeListener = <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(
        key: K,
        listener: V,
    ) => {
        type: K;
        listener: NonNullable<V>;
    };

    const parseNativeListener: ParseNativeListener = (key, listener) => ({
        type: key,
        listener,
    });

    // let key: keyof ListenerOptions;
    for (key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        if (key === 'mousedown' || key === 'mouseup' || key === 'touchstart' || key === 'touchend') {
            nativeListeners.push({type: key, listener});
        }

        listeners.push(parseListener(key, listener));
    }

    // TODO::Test if overwritten listener gets handled properly
    // const setListener: SetUserListener = (type, listener) => {
    //     const parsedListener = parseListener(type, listener);

    //     const index = listeners.findIndex(list => list.type === parsedListener.type);

    //     if (index === -1) {
    //         listeners.push(parsedListener);

    //         return;
    //     }

    //     listeners[index] = parsedListener;
    // };

    // const {addListeners, removeListeners} = createListenerMethods(listeners);

    return {setListener, handler: listeners}; // temp return (not a real handler)
};

const createListenerMethods = (listeners: EntityListener[]) => {
    // mousedown, mouseup, click (=mouseup/touchend), touchstart, touchend (native listeners)
    // startTransitionEnd, endTransitionEnd -> custom listeners used for callbacks

    // addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K])

    const nativeListeners: NativeListener[] = [];

    const parseEntityListener: ParseEntityListener = entityListener => {
        const {type, listener} = entityListener;

        if (type === 'mousedown' || type === 'mouseup' || type === 'touchstart' || type === 'touchend') {
            return {
                type,
                listener,
            };
        }

        return;
    };
};

// const createNativeListeners = (listeners: EntityListener[]) => {

// }

const createNativeListener = {
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
};

export const createListenerMethods = (listeners: EntityListener[]) => {
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

const createEventHandler = (listeners: any) => {
    //
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
