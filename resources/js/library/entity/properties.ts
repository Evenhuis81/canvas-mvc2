export const createEntityEvents = (
    {properties, listeners, engine}: InternalEntity,
    draw: Required<Draw>,
    updates: Required<Update>[],
) => {
    const show = () => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        for (let i = 0; i < updates.length; i++) engine.setUpdate(updates[i]);

        engine.setShow(draw);
    };
    const hide = () => {
        if (!properties.show) throwError(properties.id, 'hiding');

        listeners.remove(); // internal check if removed or not

        for (let i = 0; i < updates.length; i++) engine.removeUpdate(updates[i].id);

        engine.removeShow(draw.id);

        properties.show = false;
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

        for (let i = 0; i < updates.length; i++) engine.setUpdate(updates[i]);
    };
    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        listeners.remove();

        for (let i = 0; i < updates.length; i++) engine.removeUpdate(updates[i].id);

        properties.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

const setHandlers = (handlers: Partial<MouseHandlers> & Partial<TransitionHandlers>) => ({
    down: () => {},
    up: () => {},
    onStartEnd: () => {},
    onEndEnd: () => {},
    button: 0,
    ...handlers,
});

export const getHandlers = (config: Partial<EntityConfig>) => {
    // Test
    const {onStartEnd, onEndEnd} = config;

    const handlers = setHandlers({...config.mouse, onStartEnd, onEndEnd});

    return handlers;
};

export const createListeners = (sketch: EntitySketch, handlers: MouseHandlers & TransitionHandlers, {mouse}: Input) => {
    // TODO:: Listeners/Handlers should only be active according to user input
    const {down, up, button} = handlers; // Destructuring needed?
    let enabled = false;

    const mousedownListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === button) down(evt);
    };

    const mouseupListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === button) up(evt);
    };

    const transitionStartListener = () => {
        console.log('transition start internally');
    };
    const transitionEndListener = () => {
        console.log('transition end internally');
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

    // return {add, remove, listening: false};
    return {add, remove, start: transitionStartListener, end: transitionEndListener};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
