/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddEntityInputListener,
    AddListener,
    EntityConfig,
    EntityInputListenerType,
    EntityListenerEventMap,
    EntityListeners,
    EventHandler,
    FinishTransitionEvent,
    EntityInputListenerHandler,
    RemoveListener,
    EntityInputListeners,
} from 'library/types/entity';
import type {InputListenerEventMap, LibraryInput} from 'library/types/input';

export const createEventHandler = (
    input: LibraryInput,
    sketch: Shape,
    listeners: EntityConfig['listeners'],
): EventHandler => {
    const inputListenerHandlers: {[type: string]: EntityInputListenerHandler} = {};
    const entityListenerEvents = createEntityListenerEvents();
    const entityListeners: Partial<EntityListeners> = {};
    const activate = () => Object.values(inputListenerHandlers).forEach(handler => handler[1]()); // deactivate method
    const deactivate = () => Object.values(inputListenerHandlers).forEach(handler => handler[2]()); // activate method

    const addEntityInputListener = createAddInputListener(
        inputListenerHandlers,
        input,
        sketch,
        entityListenerEvents.finishTransition,
    );

    const {addListener, removeListener} = createAddAndRemoveListener(
        inputListenerHandlers,
        entityListeners,
        addEntityInputListener,
        input,
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

    const {startTransition, finishTransition, inputListeners} = filterListeners(listeners);

    setEntityInputListeners(inputListeners, addEntityInputListener);

    return {
        addListener,
        removeListener,
        activateInputListeners: activate,
        deactivateInputListeners: deactivate,
        entityListenerEvents,
        entityListeners,
    };
};

const filterListeners = ({
    startTransition,
    finishTransition,
    ...inputListeners
}: Partial<EntityListeners & EntityInputListeners<EntityInputListenerType>>) => ({
    startTransition,
    finishTransition,
    inputListeners,
});

const createAddInputListener =
    (
        inputListenerHandlers: {[type: string]: EntityInputListenerHandler},
        input: LibraryInput,
        sketch: Shape,
        props: FinishTransitionEvent,
    ): AddEntityInputListener =>
    (type, listener, activate = true) => {
        const id = Symbol();

        inputListenerHandlers[type] = [
            type,
            () => input.addListener({type, listener, id, shape: sketch, props}),
            () => input.removeListener(type, id),
            activate,
        ];

        if (activate) inputListenerHandlers[type][1]();

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

const createAddAndRemoveListener: (
    inputListenerHandlers: {[type: string]: EntityInputListenerHandler},
    entityListeners: Partial<EntityListeners>,
    addInputListener: AddEntityInputListener,
    input: LibraryInput,
) => {
    addListener: AddListener;
    removeListener: RemoveListener;
} = (inputListenerHandlers, entityListeners, addInputListener, input) => ({
    addListener: <K extends keyof EntityListeners | keyof InputListenerEventMap>(
        type: K,
        listener: (evt: (EntityListenerEventMap & InputListenerEventMap)[K]) => void,
    ) => {
        const ll: Partial<EntityListeners<K>> = {};

        ll[type] = listener;

        // TODO::Make seperate method for adding individual inputListener
        setEntityInputListeners(ll, addInputListener);
    },
    removeListener: type => {
        if (type === 'startTransition') return delete entityListeners.startTransition;
        if (type === 'finishTransition') return delete entityListeners.finishTransition;

        // const {startTransition, finishTransition, inputListeners} = filterListeners(listeners);
        // setInputListeners(inputListeners, addInputListener);

        const handler = inputListenerHandlers[type];

        if (handler) {
            // input.removeListener(type, handler[0]); // type + id

            handler[2](); // deactivate listener

            delete inputListenerHandlers[type];
        }

        return;

        // TODO::Throw Library Error
    },
});

const startTransition = {testProperty: 'testProperty startTransition'};
const finishTransition = {pressed: false, pushed: false, clicked: false};

const createEntityListenerEvents = () => ({
    startTransition: {...startTransition},
    finishTransition: {...finishTransition},
});
