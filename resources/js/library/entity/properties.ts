/* eslint-disable max-lines-per-function */
export const createEntityEvents = ({animations, properties, listeners}: InternalEntity, callBacks: EntityCallBacks) => {
    const show = (quickShow = animations.startType === 'none') => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        callBacks.start(quickShow);
    };

    const hide = (quickHide = animations.endType === 'none') => {
        if (!properties.show) throwError(properties.id, 'hiding');

        properties.show = false;

        listeners.remove();

        callBacks.end(quickHide);
    };

    const destroy = () => {
        // Optional end transition on destroy?
        listeners.remove();

        if (properties.show) hide(false);

        if (!properties.disabled) disable();
    };

    const enable = () => {
        if (!properties.disabled) throwError(properties.id, 'enabled');

        properties.disabled = false;

        listeners.add();

        // enable handlers / animations / create enable properties (sketch, colors or such)
    };

    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        listeners.remove();

        properties.disabled = true;

        // disable handlers / animations / create disable properties (sketch, colors or such)
    };

    return {show, hide, destroy, enable, disable};
};

// Mouse and Transition handlers mixed
export const getHandlers = (mouse: Partial<MouseHandlers>, transitions: Partial<TransitionHandlers>) => ({
    down: () => {},
    up: () => {},
    onStartEnd: () => {
        console.log('default onStartEnd internally');
    },
    onEndEnd: () => {
        console.log('default onEndEnd internally');
    },
    button: 0,
    ...mouse,
    ...transitions,
});

export const createListeners = (sketch: EntitySketch, handlers: MouseHandlers & TransitionHandlers, {mouse}: Input) => {
    // TODO:: activate listeners/Handlers according to user input
    const {down, up, button} = handlers;
    let enabled = false;

    const mousedownListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === button) down(evt);
    };

    const mouseupListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === button) up(evt);
    };

    const add = () => {
        if (enabled) return;

        enabled = true;

        addEventListener('mousedown', mousedownListener);
        addEventListener('mouseup', mouseupListener);
    };

    const remove = () => {
        if (!enabled) return;

        removeEventListener('mousedown', mousedownListener);
        removeEventListener('mouseup', mouseupListener);

        enabled = false;
    };

    return {add, remove};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
