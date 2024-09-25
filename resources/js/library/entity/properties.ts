/* eslint-disable max-lines-per-function */
export const createEntityEvents = ({properties, animations, listeners}: InternalEntity, render: Render) => {
    const show = () => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        render('draw', true);
        if (animations.startType) render('start', true);
    };

    const hide = () => {
        if (!properties.show) throwError(properties.id, 'hiding');

        properties.show = false;

        listeners.remove();
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

        // setEngine(); // update only
    };
    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        listeners.remove();

        // setEngine({}); // update only

        properties.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

const setDraw = (engine: Engine, draw: Required<Draw>, state: boolean) =>
    state ? engine.setShow(draw) : engine.removeShow(draw.id);

const handleUpdate = {
    set: (engine: Engine, update: Required<Update>) => engine.setUpdate(update),
    remove: (engine: Engine, update: Required<Update>) => engine.removeUpdate(update.id),
};

export const createRender =
    (engine: Engine, renders: EntityRenders): Render =>
    (type, state) => {
        if (type === 'draw') return setDraw(engine, renders.draw, state);

        handleUpdate[state ? 'set' : 'remove'](engine, renders[type]);
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
