export const createEntityEvents = ({properties, listeners, setEngine}: InternalEntity, renders: EntityRenders) => {
    const show = (startTransition = false) => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        setEngine(renders, {startTransition, draw: true});
    };
    const hide = (endTransition = false) => {
        if (!properties.show) throwError(properties.id, 'hiding');

        properties.show = false;

        listeners.remove();

        setEngine(renders, {endTransition, draw: false});
    };
    const destroy = () => {
        listeners.remove();

        if (properties.show) hide();

        if (!properties.disabled) disable();
    };
    const enable = () => {
        if (!properties.disabled) throwError(properties.id, 'enabled');

        properties.disabled = false;

        listeners.add();

        setEngine(renders); // update only
    };
    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        listeners.remove();

        setEngine(renders); // update only

        properties.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

// Mouse and Transition handlers mixed
export const getHandlers = (mouse: Partial<MouseHandlers>, transitions: Partial<TransitionHandlers>) => ({
    down: () => {},
    up: () => {},
    onStartEnd: () => {},
    onEndEnd: () => {},
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
