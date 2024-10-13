/* eslint-disable max-lines-per-function */
export const createUserEntity = ({visualProperties, properties, entityListeners, callBacks}: Entity) => {
    // parameter default gives auto start (and end) transitions if type !'none', manually able to set by user input
    const show = (quickShow = !visualProperties.startType) => {
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        entityListeners.add();

        callBacks.start(quickShow);
    };

    const hide = (quickHide = !visualProperties.endType, hideTime = properties.hideTime) => {
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
        // if (properties.disabled) throwError(properties.id, 'disabled');
        // entityListeners.remove();
        // properties.disabled = true;
        // disable handlers / animations / create disable properties (sketch, colors, etc)
    };

    const setHideTime = (time: number) => (properties.hideTime = time);

    // const setVisualProperty = <K extends keyof EntityVisualProperties>(
    //     type: K,
    //     value: EntityVisualProperties[K],
    // ) => {
    //     animations[type] = value;
    // };

    return {show, hide, destroy, enable, disable, setHideTime};
};

// TODO::Make optional
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
    touchstart: () => {
        console.log('touchstart listener internal');
    },
    touchend: () => {
        console.log('touchend listener internal');
    },
    clickdown: () => {
        console.log('clickdown listener internal');
    },
    clickup: () => {
        console.log('clickup listener internal');
    },
};

export const createUserListeners = (userListeners?: Partial<UserListeners>) => {
    const listeners = {...userListeners};

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

export const createEntityListeners = ({sketch, userListeners, properties, input: {mouse, touch}}: EntityTemp) => {
    const {mousedown, mouseup, touchstart, touchend, clickdown, clickup} = userListeners;
    let enabled = false;

    // create dynamic object to call handlers automatically that are set by the user, use exisiting types for this if possible
    const listeners = [];

    const mousedownListener = (evt: MouseEvent) => {
        // statistic click counter and make button dynamic
        if (mouse.insideRect(sketch)) {
            if (clickdown) clickdown({clicked: properties.clicked, evt});
            if (mousedown) mousedown({clicked: properties.clicked, evt});
        }
    };

    const mouseupListener = (evt: MouseEvent) => {
        // statistic release counter (inside or outside), can be used to check clicked (to remove clicked property)
        if (mouse.insideRect(sketch)) {
            properties.clicked = true;

            userListeners.mouseup({clicked: properties.clicked, evt});

            // See below comments, until done, choose mouse or touch to call usermethod
            userListeners.clickup({clicked: properties.clicked, evt});
        }
    };

    // To call 1 method for userListener and send both mouse and touch events on 'click', requires 1st line method TODO
    const touchstartListener = (evt: TouchEvent) => {
        if (touch.insideRect(sketch)) {
            properties.clicked = true;

            userListeners.touchstart({clicked: properties.clicked, evt});
        }
    };

    const touchendListener = (evt: TouchEvent) => {
        if (touch.insideRect(sketch)) {
            properties.clicked = true;

            userListeners.touchend({clicked: properties.clicked, evt});
        }
    };

    const add = () => {
        if (enabled) return;

        enabled = true;

        addEventListener('mousedown', mousedownListener);
        addEventListener('mouseup', mouseupListener);
        addEventListener('touchstart', touchstartListener);
        addEventListener('touchend', touchendListener);
    };

    const remove = () => {
        if (!enabled) return;

        removeEventListener('mousedown', mousedownListener);
        removeEventListener('mouseup', mouseupListener);
        removeEventListener('touchstart', touchstartListener);
        removeEventListener('touchend', touchendListener);

        enabled = false;
    };

    return {add, remove};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
