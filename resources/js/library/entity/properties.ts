export const createEntityEvents = ({animations, properties, listeners}: InternalEntity, callBacks: EntityCallBacks) => {
    // parameter default gives auto start (and end) transitions if type !'none', manually able to set by user input
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
        // = hide ? test and fix later (possibly have user input parameters)
        // listeners.remove();
        // if (properties.show) hide(false);
        // if (!properties.disabled) disable();
    };

    const enable = () => {
        // =show ? test and fix later (possibly have user input parameters)
        // if (!properties.disabled) throwError(properties.id, 'enabled');
        // properties.disabled = false;
        // listeners.add();
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
export const createHandlers = (
    mouseHandlers?: Partial<MouseHandlers>,
    transitionHandlers?: Partial<TransitionHandlers>,
) => ({
    down: () => {
        console.log('mouse down entity internal');
    },
    up: () => {
        console.log('mouse up entity internal');
    },
    onStartEnd: () => {
        console.log('onStartEnd entity internal');
    },
    onEndEnd: () => {
        console.log('onEndEnd entity internal');
    },
    button: 0,
    ...mouseHandlers,
    ...transitionHandlers,
});

export const createListeners = (sketch: EntitySketch, handlers: MouseHandlers & TransitionHandlers, {mouse}: Input) => {
    // TODO:: activate listeners/Handlers according to user input
    // const {down, up, button} = handlers;
    let enabled = false;

    const mousedownListener = (evt: MouseEvent) => {
        // statistic click counter
        if (mouse.insideRect(sketch) && evt.button === handlers.button) handlers.down(evt);
    };

    const mouseupListener = (evt: MouseEvent) => {
        // statistic release counter (inside or outside)
        if (mouse.insideRect(sketch) && evt.button === handlers.button) handlers.up(evt);
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
