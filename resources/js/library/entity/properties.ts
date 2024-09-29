/* eslint-disable max-lines-per-function */
export const createEntityEvents = ({animations, properties, listeners}: InternalEntity, callBacks: EntityCallBacks) => {
    const show = (startTransition = animations.startType !== 'none') => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        callBacks.start(startTransition); // option for transition on show (user input)
    };

    const hide = (endTransition = animations.endType !== 'none') => {
        if (!properties.show) throwError(properties.id, 'hiding');

        properties.show = false;

        listeners.remove();

        callBacks.end(endTransition); // need an additional callBack -> stop (full stop)
    };

    const destroy = () => {
        listeners.remove();

        if (properties.show) hide(false);

        if (!properties.disabled) disable();
    };

    const enable = () => {
        if (!properties.disabled) throwError(properties.id, 'enabled');

        properties.disabled = false;

        listeners.add();

        callBacks.start(); // might need an additional callBack -> small start (no transition, user input?)
    };

    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        listeners.remove();

        // callBacks.stop() see comment on hide()

        properties.disabled = true;
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
