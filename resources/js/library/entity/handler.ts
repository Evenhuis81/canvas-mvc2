/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddEntityInputListener,
    EntityConfig,
    EntityInputListenerHandler,
    EntityInputListenerType,
    EntityInputListeners,
    EntityListenerEvents,
    EntityListeners,
    FinishTransitionEvent,
} from 'library/types/entity';
import type {InputListenerEventMap, LibraryInput} from 'library/types/input';

export const createEventHandler = (input: LibraryInput, sketch: Shape, listeners: EntityConfig['listeners']) => {
    const entityInputListenerHandlers: {[type: string]: EntityInputListenerHandler} = {};
    const entityListenerEvents = createEntityListenerEvents();
    const entityListeners: Partial<EntityListeners> = {};
    const activate = () => Object.values(entityInputListenerHandlers).forEach(handler => handler[1]());
    const deactivate = () => Object.values(entityInputListenerHandlers).forEach(handler => handler[2]());

    const addEntityInputListener = createAddEntityInputListener(
        entityInputListenerHandlers,
        input,
        sketch,
        entityListenerEvents.finishTransition,
    );

    const {addListener, removeListener} = createAddAndRemoveListener(
        entityInputListenerHandlers,
        entityListeners,
        addEntityInputListener,
    );

    if (!listeners) {
        return {
            addListener,
            removeListener,
            entityListenerEvents,
            entityListeners,
            activateInputListeners: activate,
            deactivateInputListeners: deactivate,
        };
    }

    const {startTransition, finishTransition, ...entityInputListeners} = listeners;

    if (startTransition) entityListeners.startTransition = startTransition;
    if (finishTransition) entityListeners.finishTransition = finishTransition;

    setEntityInputListeners(entityInputListeners, addEntityInputListener);

    return {
        addListener,
        removeListener,
        activateInputListeners: activate,
        deactivateInputListeners: deactivate,
        entityListenerEvents,
        entityListeners,
    };
};

const createAddEntityInputListener =
    (
        entityInputListenerHandlers: {[type: string]: EntityInputListenerHandler},
        input: LibraryInput,
        sketch: Shape,
        props: FinishTransitionEvent,
    ): AddEntityInputListener =>
    (type, listener, active = true) => {
        const id = Symbol();

        entityInputListenerHandlers[type] = [
            type,
            () => input.addListener({type, listener, id, shape: sketch, props}),
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
        if (type === 'finishTransition') return (entityListeners.finishTransition = listener);

        addEntityInputListener(type, listener);

        return undefined;
    },
    removeListener: (type: keyof EntityListeners | EntityInputListenerType) => {
        if (type === 'startTransition') return delete entityListeners.startTransition;
        if (type === 'finishTransition') return delete entityListeners.finishTransition;

        const handler = entityInputListenerHandlers[type];

        if (handler) handler[2](); // deactivate listener

        delete entityInputListenerHandlers[type];

        return undefined;
    },
});

const startTransition = {testProperty: 'testProperty startTransition'};
const finishTransition = {pressed: false, pushed: false, clicked: false};

const createEntityListenerEvents = () => ({
    startTransition: {...startTransition},
    finishTransition: {...finishTransition},
});
