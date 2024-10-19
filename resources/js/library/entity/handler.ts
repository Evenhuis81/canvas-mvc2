import type {EntityListener, ParseListenerOption, SetUserListener, Sketch, ListenerOptions} from 'library/types/entity';

export const createHandler = (listenerOptions: Partial<ListenerOptions> = {}) => {
    const listeners: EntityListener[] = [];

    const parseListener: ParseListenerOption = (key, listener) => ({
        type: key,
        listener,
    });

    let key: keyof ListenerOptions;
    for (key in listenerOptions) {
        const listener = listenerOptions[key];

        if (!listener) continue;

        listeners.push(parseListener(key, listener));
    }

    // TODO::Test if overwritten listener gets handled properly
    const setListener: SetUserListener = (type, listener) => {
        const parsedListener = parseListener(type, listener);

        const index = listeners.findIndex(list => list.type === parsedListener.type);

        if (index === -1) {
            listeners.push(parsedListener);

            return;
        }

        listeners[index] = parsedListener;
    };

    return {setListener, listeners};
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
