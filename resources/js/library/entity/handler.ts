/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {EntityConfigListeners, EntityEventMap} from 'library/types/entity';
import {Input} from 'library/types/input';

export const createEventHandler = <T extends keyof EntityEventMap>(
    input: Input,
    listeners?: Partial<EntityConfigListeners<T>>,
) => {
    const listenerHandlers: ListenerHandler[] = [];

    const eventHandler = {
        setListener: createSetListener(listenerHandlers, input),
        addListeners: () => listenerHandlers.forEach(l => l.add()),
        removeListeners: () => listenerHandlers.forEach(l => l.remove),
        startTransitionEnd: () => {},
        endTransitionEnd: () => {},
    };

    if (!listeners) return eventHandler;

    const makeKeyRemover =
        <Key extends string | number | symbol>(keys: Key[]) =>
        <Obj extends Partial<Record<Key, unknown>>>(obj: Obj): Omit<Obj, Key> => {
            const result = {...obj};
            keys.forEach(key => {
                if (key in obj) delete result[key];
            });

            return result;
        };

    const keyR = makeKeyRemover(['startTransitionEnd', 'endTransitionEnd']);

    const newListeners = keyR(listeners);

    const ttt = <K extends keyof Omit<EntityEventMap, 'startTransitionEnd' | 'endTransitionEnd'>>(
        listenerss?: Partial<EntityConfigListeners<K>>,
    ) => {
        for (const key in listenerss) {
            const listener = listenerss[key];

            if (!listener) continue;

            eventHandler.setListener(key, listener);
        }
    };

    ttt(newListeners);

    return eventHandler;
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
    <K extends keyof Omit<EntityEventMap, 'startTransitionEnd' | 'endTransitionEnd'>>(
        type: K,
        listener: (evt: EntityEventMap[K]) => void,
    ) => {
        const run = () => listener(entityProps[type]);

        input.setInput(type, run);

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
