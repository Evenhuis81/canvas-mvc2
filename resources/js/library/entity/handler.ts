import {ListenerMethods} from 'library/types/entity';

// export type ListenerOptions = ListenerOptionsNative & ListenerOptionsCustom;

// export interface EntityHandler extends ListenerMethods {
// parsed: EntityListener[];
// native: NativeListener[];
// // custom: any[];
// }

// export type ParseListenerOption = <K extends keyof ListenerOptions, V extends ListenerOptions[K]>(
//     key: K,
//     listener: V,
// ) => {
//     type: K;
//     listener: NonNullable<V>;
// };

// export type ParseEntityListener = <
//     NativeType extends keyof WindowEventMap,
//     NativeEvent extends WindowEventMap[NativeType],
// >(
//     entityListener: EntityListener,
// ) =>
//     | {
//           type: NativeType;
//           listener: (evt: NativeEvent) => void;
//       }
//     | undefined;

// export type EntityListener = Extract<ReturnType<ParseListenerOption>, {}>;

// export type NativeListener = ReturnType<ParseEntityListener>;

// key: NativeType,
// listener: (evt: NativeEvent) => void,
// ) => {
//     type: NativeType;
//     listener: (evt: NativeEvent) => void;
// };

// , NativeEvent extends WindowEventMap[NativeType]
export type NativeEvent<NativeType extends keyof HTMLElementEventMap> = {
    [Key in NativeType]: (evt: HTMLElementEventMap[Key]) => void;
};

// export type NativeListener = {

// }

export const createHandler = <K extends keyof HTMLElementEventMap>(
    canvas: HTMLCanvasElement,
    listeners?: NativeEvent<K>,
) => {
    const nativeListeners = <NativeEvent<K>>{};

    // canvas.addEventListener('touchstart', (evt) => {
    //     evt.
    // })

    addEventListener('touchstart', evt => {
        console.log('click on window eventlistener', evt);
    });

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        // canvas.addEventListener(key, listener);
        canvas.addEventListener(key, listener);
        // nativeListeners[key] = listener;
    }
    // const nativeListeners: ReturnType<ParseNativeListener>[] = [];
    // type ParseNativeListener = <K extends keyof WindowEventMap, V extends (evt: WindowEventMap[K]) => void>(
    //     key: K,
    //     listener: V,
    // ) => {
    //     type: K;
    //     listener: V;
    // };
    // const parseNativeListener: ParseNativeListener = (key, listener) => ({
    //     type: key,
    //     listener,
    // });
    // let key: keyof WindowEventMap;
    // for (key in listeners) {
    // const listener = listeners[key];
    // if (!listener) continue;
    // addEventListener(key, listener);
    // nativeListeners.push(parseNativeListener(key, listener));
    // }
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
