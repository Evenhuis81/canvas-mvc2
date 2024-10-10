/* eslint-disable max-lines-per-function */
export const createEntityEvents = (
    {animations, properties, entityListeners}: InternalEntity,
    callBacks: EntityCallBacks,
) => {
    // parameter default gives auto start (and end) transitions if type !'none', manually able to set by user input
    const show = (quickShow = animations.startType === 'none') => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        entityListeners.add();

        callBacks.start(quickShow);
    };

    const hide = (quickHide = animations.endType, hideTime = properties.hideTime) => {
        if (!properties.show) throwError(properties.id, 'hiding');

        const hideMe = () => {
            properties.show = false;

            entityListeners.remove();

            callBacks.end(quickHide);
        };

        if (hideTime) {
            setTimeout(() => {
                hideMe();
            }, hideTime);

            return;
        }

        hideMe();
    };

    const destroy = () => {
        // = hide ? test and fix later (possibly have user input parameters)
        // entityListeners.remove();
        // if (properties.show) hide(false);
        // if (!properties.disabled) disable();
    };

    const enable = () => {
        // =show ? test and fix later (possibly have user input parameters)
        // if (!properties.disabled) throwError(properties.id, 'enabled');
        // properties.disabled = false;
        // entityListeners.add();
        // enable handlers / animations / create enable properties (sketch, colors or such)
    };

    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        entityListeners.remove();

        properties.disabled = true;

        // disable handlers / animations / create disable properties (sketch, colors or such)
    };

    return {show, hide, destroy, enable, disable};
};

const defaultUserListeners: UserListeners = {
    mousedown: () => {
        console.log('mousedown listener internal');
    },
    mouseup: () => {
        console.log('mouseup listener internal');
    },
    startTransitionEnd: () => {
        console.log('startTransitionEnd listener internal');
    },
    endTransitionEnd: () => {
        console.log('endTransitionEnd listener internal');
    },
};

// Mouse and Transition handlers mixed
export const createUserListeners = (userListeners?: Partial<UserListeners>) => {
    const listeners = {...defaultUserListeners};

    // User input handlers after creation
    const setListener: SetUserListener = (type, listener) => {
        if (!listener) return;

        listeners[type] = listener;
    };

    if (!userListeners) return {setListener, userListeners: listeners};

    let key: keyof UserListeners;
    for (key in userListeners) setListener(key, userListeners[key]);

    return {setListener, userListeners: listeners};
};

export const createListeners = (
    sketch: EntitySketch,
    userListeners: UserListeners,
    properties: EntityProperties,
    {mouse}: Input,
) => {
    // TODO:: activate listeners/Handlers according to user input
    let enabled = false;

    const mousedownListener = (evt: MouseEvent) => {
        // statistic click counter and make button dynamic
        if (mouse.insideRect(sketch)) userListeners.mousedown(evt);
    };

    const mouseupListener = (evt: MouseEvent) => {
        // statistic release counter (inside or outside)
        if (mouse.insideRect(sketch)) {
            properties.clicked = true;

            userListeners.mouseup(evt, properties.clicked);
        }
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
