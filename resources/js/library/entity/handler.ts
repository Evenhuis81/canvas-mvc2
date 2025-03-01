/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
import {EntityShapeMap} from 'library/types/entitySketch';
import type {
    AddEntityInputListener,
    EntityHandler,
    EntityInputListenerHandler,
    EntityInputListenerType,
    EntityInputListeners,
    EntityListenerEvents,
    EntityListeners,
} from 'library/types/entity';
import type {InputListenerEventMap, LibraryInput} from 'library/types/input';

export const createEventHandler = <K extends keyof EntityShapeMap>(
    input: LibraryInput,
    sketch: EntityShapeMap[K],
    listeners?: Partial<EntityListeners & EntityInputListeners<EntityInputListenerType>>,
) => {
    const entityInputListenerHandlers: {[type: string]: EntityInputListenerHandler} = {};
    const entityListeners: Partial<EntityListeners> = {};
    const activate = () => Object.values(entityInputListenerHandlers).forEach(handler => handler[1]());
    const deactivate = () => Object.values(entityInputListenerHandlers).forEach(handler => handler[2]());

    const addEntityInputListener = createAddEntityInputListener(entityInputListenerHandlers, input, sketch);

    const {addListener, removeListener} = createAddAndRemoveListener(
        entityInputListenerHandlers,
        entityListeners,
        addEntityInputListener,
    );

    const handler: EntityHandler = {
        addListener,
        removeListener,
        entityListeners,
        activateInputListeners: activate,
        deactivateInputListeners: deactivate,
    };

    if (!listeners) return handler;

    // Make generic with split object: (https://stackoverflow.com/questions/75323570/what-is-the-correct-type-for-splitting-an-object-in-two-complimentary-objects-in)
    const {startTransition, endTransition, endOfStartTransition, endOfEndTransition, ...entityInputListeners} =
        listeners;

    if (startTransition) entityListeners.startTransition = startTransition;
    if (endOfStartTransition) entityListeners.endOfStartTransition = endOfStartTransition;
    if (endTransition) entityListeners.endTransition = endTransition;
    if (endOfEndTransition) entityListeners.endOfEndTransition = endOfEndTransition;

    setEntityInputListeners(entityInputListeners, addEntityInputListener);

    return handler;
};

const createAddEntityInputListener =
    <T extends keyof EntityShapeMap>(
        entityInputListenerHandlers: {[type: string]: EntityInputListenerHandler},
        input: LibraryInput,
        sketch: EntityShapeMap[T],
    ): AddEntityInputListener =>
    <K extends EntityInputListenerType>(
        type: K, // = ID (1 type per entity)
        listener: (evt: HTMLElementEventMap[K]) => void,
        active: boolean = true,
    ) => {
        // const newListener = (evt: HTMLElementEventMap[K], inputType: string) => {
        //     console.log(inputType);

        //     listener(evt);
        // };

        const id = Symbol();

        entityInputListenerHandlers[type] = [
            type,
            () =>
                input.addListener({
                    type,
                    // listener: newListener,
                    listener,
                    id,
                    shape: sketch.inputType !== 'none' ? sketch : undefined,
                }),
            () => input.removeListener(type, id),
            active,
        ];

        if (active) entityInputListenerHandlers[type][1]();

        return id;
    };

const setEntityInputListeners = <K extends EntityInputListenerType>(
    listeners: Partial<EntityInputListeners<K>>,
    addEntityInputListener: AddEntityInputListener,
) => {
    for (const type in listeners) {
        const listener = listeners[type];

        if (!listener) continue;

        addEntityInputListener(type, listener, false);
    }
};

const createAddAndRemoveListener = (
    entityInputListenerHandlers: {[type: string]: EntityInputListenerHandler},
    entityListeners: Partial<EntityListeners>,
    addEntityInputListener: AddEntityInputListener,
) => ({
    addListener: (
        type: keyof EntityListeners | EntityInputListenerType,
        listener: (
            evt: (EntityListenerEvents & InputListenerEventMap)[keyof EntityListeners | EntityInputListenerType],
        ) => void,
    ) => {
        if (type === 'startTransition') return (entityListeners.startTransition = listener);
        if (type === 'endTransition') return (entityListeners.endTransition = listener);
        if (type === 'endOfStartTransition') return (entityListeners.endOfStartTransition = listener);
        if (type === 'endOfEndTransition') return (entityListeners.endOfEndTransition = listener);

        addEntityInputListener(type, listener);

        return undefined;
    },
    removeListener: (type: keyof EntityListeners | EntityInputListenerType) => {
        if (type === 'startTransition') return delete entityListeners.startTransition;
        if (type === 'endTransition') return delete entityListeners.endTransition;
        if (type === 'endOfStartTransition') return delete entityListeners.endOfStartTransition;
        if (type === 'endOfEndTransition') return delete entityListeners.endOfEndTransition;

        const handler = entityInputListenerHandlers[type];

        if (handler) handler[2](); // deactivate listener

        delete entityInputListenerHandlers[type];

        return undefined;
    },
});
