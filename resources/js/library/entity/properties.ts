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

export const getMouseHandlers = (mouseHandlers?: Partial<MouseHandlers>) => ({
    mousedown: () => {},
    mouseup: () => {},
    mousebutton: 0,
    ...mouseHandlers,
});

export const createListeners = (sketch: EntitySketch, mouseHandlers: MouseHandlers, {mouse}: Input) => {
    const {mousedown, mouseup, mousebutton} = mouseHandlers;
    let enabled = false;

    const mousedownListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === mousebutton) mouseHandlers.mousedown(evt);
    };

    const mouseupListener = (evt: MouseEvent) => {
        if (mouse.insideRect(sketch) && evt.button === mousebutton) mouseup(evt);
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

    return {add, remove, listening: false};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
