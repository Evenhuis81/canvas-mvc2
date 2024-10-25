import {
    EntityEventMap,
    EntityInputEventMap,
    EntityListeners,
    ListenerHandler,
    SetEntityListener,
} from 'library/types/entity';

const entityProps = {
    mousedown: {mouseProp: 'testString mouseprop'},
    mousemove: {mouseProp: 'testString mouseprop'},
    mouseup: {mouseProp: 'testString mouseprop'},
    keydown: {keyProp: 'testString keyprop'},
    keyup: {keyProp: 'testString keyprop'},
    touchstart: {touchProp: 'testString touchprop'},
    touchmove: {touchProp: 'testString touchprop'},
    touchend: {touchProp: 'testString touchprop'},
};

export const createListeners = <T extends keyof EntityInputEventMap>(
    canvas: HTMLCanvasElement,
    listeners?: Partial<EntityListeners<T>>,
) => {
    if (!listeners) return;

    const listenerHandlers: ListenerHandler[] = [];

    const setEntityListener: SetEntityListener = (type, listener) => {
        const eListener = (evt: EntityInputEventMap[typeof type]) =>
            listener({entityEvent: entityProps[type], inputEvent: evt});

        const add = () => canvas.addEventListener(type, eListener);

        const remove = () => canvas.removeEventListener(type, eListener);

        const index = listenerHandlers.findIndex(t => t.type === type);

        if (index === -1) return add();

        listenerHandlers[index].remove();

        // TODO::Test if overwritten listener gets handled properly
        listenerHandlers[index] = {type, add, remove};

        add();
    };

    for (const key in listeners) {
        const listener = listeners[key];

        if (!listener) continue;

        // TODO::Convert this to a mixed custom & native event listener type
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

const createListenerMethods = () => {
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
