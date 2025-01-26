/* eslint-disable max-lines-per-function */
import {Shape} from 'library/types/shapes';
import type {
    AddInputListener,
    AddListener,
    EntityConfig,
    EntityListenerEventMap,
    EntityListeners,
    EventHandler,
    FinishTransitionEvent,
    InputListenerHandler,
    InputListenersGeneric,
    ListenersGeneric,
    RemoveListener,
} from 'library/types/entity';
import type {InputListenerEventMap, LibraryInput} from 'library/types/input';

export const createEventHandler = (
    input: LibraryInput,
    sketch: Shape,
    listeners: EntityConfig['listeners'],
): EventHandler => {
    const inputListenerHandlers: {[type: string]: InputListenerHandler} = {};
    const entityListenerEvents = createEntityListenerEvents();
    const activate = () => Object.values(inputListenerHandlers).forEach(handler => handler[1]()); // deactivate method
    const deactivate = () => Object.values(inputListenerHandlers).forEach(handler => handler[2]()); // activate method

    const addInputListener = createAddInputListener(
        inputListenerHandlers,
        input,
        sketch,
        entityListenerEvents.finishTransition,
    );

    const {addListener, removeListener} = createAddAndRemoveListener(inputListenerHandlers, addInputListener, input);

    if (!listeners) {
        return {
            addListener,
            removeListener,
            entityListenerEvents,
            activateInputListeners: activate,
            deactivateInputListeners: deactivate,
        };
    }

    const {startTransition, finishTransition, inputListeners} = filterListeners(listeners);

    setInputListeners(inputListeners, addInputListener);

    return {
        addListener,
        removeListener,
        activateInputListeners: activate,
        deactivateInputListeners: deactivate,
        entityListenerEvents,
        startTransition,
        finishTransition,
    };
};

const filterListeners = ({
    startTransition,
    finishTransition,
    ...inputListeners
}: Partial<EntityListeners & InputListenersGeneric<keyof InputListenerEventMap>>) => ({
    startTransition,
    finishTransition,
    inputListeners,
});

const createAddInputListener =
    (
        inputListenerHandlers: {[type: string]: InputListenerHandler},
        input: LibraryInput,
        sketch: Shape,
        props: FinishTransitionEvent,
    ): AddInputListener =>
    (type, listener, activate = true) => {
        const id = Symbol();

        inputListenerHandlers[type] = [
            id,
            () => input.addListener({type, listener, id, shape: sketch, props}),
            () => input.removeListener(type, id),
            activate,
        ];

        if (activate) inputListenerHandlers[type][1]();

        return id;
    };

const setInputListeners = <K extends keyof InputListenerEventMap>(
    listeners: Partial<InputListenersGeneric<K>>,
    addInputListener: AddInputListener,
) => {
    for (const type in listeners) {
        const listener = listeners[type];

        if (!listener) continue;

        addInputListener(type, listener, false);
    }
};

const createAddAndRemoveListener: (
    inputListenerHandlers: {[type: string]: InputListenerHandler},
    addInputListener: AddInputListener,
    input: LibraryInput,
) => {
    addListener: AddListener;
    removeListener: RemoveListener;
} = (inputListenerHandlers, addInputListener, input) => ({
    addListener: <K extends keyof EntityListeners | keyof InputListenerEventMap>(
        type: K,
        listener: (evt: (EntityListenerEventMap & InputListenerEventMap)[K]) => void,
    ) => {
        const ll: Partial<ListenersGeneric<K>> = {};

        ll[type] = listener;

        // TODO::Make seperate method for adding individual inputListener
        setInputListeners(ll, addInputListener);
    },
    removeListener: type => {
        if (type === 'startTransition') return;
        if (type === 'finishTransition') return;

        const handler = inputListenerHandlers[type];

        if (handler) {
            input.removeListener(type, handler[0]); // type + id

            delete inputListenerHandlers[type];
        }

        // TODO::Throw Library Error
    },
});

const startTransition = {testProperty: 'testProperty startTransition'};
const finishTransition = {pressed: false, pushed: false, clicked: false};

const createEntityListenerEvents = () => ({
    startTransition: {...startTransition},
    finishTransition: {...finishTransition},
});
