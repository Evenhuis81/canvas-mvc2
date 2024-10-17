/* eslint-disable max-lines-per-function */
export const createUserEntity = (
    visualProperties: EntityVisualProperties,
    properties: EntityProperties,
    listeners: ListenerHandler,
    callBacks: EntityCallBacks,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !visualProperties.startType) => {
        // Make throwError more general and easier to use (less parameters)
        if (properties.show) throw Error('show is already active');
        // throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        callBacks.start(quickShow);
    };

    const hide = (quickHide = !visualProperties.endType, hideTime = properties.hideTime) => {
        if (!properties.show) throw Error('hide is already active');
        // throwError(properties.id, 'hiding');

        const hideMe = () => {
            properties.show = false;

            listeners.remove();

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

    const setHideTime = (time: number) => (properties.hideTime = time);

    return {show, hide, setHideTime};
};

export const createListeners = (userListeners: Partial<UserListeners> = {}) => {
    if (userListeners.clickdown && (userListeners.mousedown || userListeners.touchstart))
        throwError('clickdownconflict');
    if (userListeners.clickup && (userListeners.mouseup || userListeners.touchend)) throwError('clickupconflict');

    // TODO::Seperate eventListeners and entityCallBacks (onStartEnd etc) possibly make object: {callBacks: user: {}, entity: {}}
    const listeners: ParsedListener[] = [];

    const parseListener: ParseListener = (key, listener) => ({
        type: key,
        listener,
    });

    let key: keyof UserListeners;
    for (key in userListeners) {
        const ll = userListeners[key];

        if (!ll) continue;

        listeners.push(parseListener(key, ll));
    }

    // User input handlers after creation
    // TODO::Test if overwritten listener gets handled properly
    const setListener: SetUserHandler = (type, listener) => {
        const parsedListener = parseListener(type, listener);

        const index = listeners.findIndex(list => list.type === parsedListener.type);

        if (index === -1) {
            listeners.push(parsedListener);

            return;
        }

        listeners[index] = parsedListener;
    };

    return {setListener, listeners: createEventHandler(listeners)};
};

const createEventHandler = (listeners: ) => {
    //
}

const createEventListener = {
    mouseup: () => {},
    mousedown: () => {},
    startTransitionEnd: () => {},
    endTransitionEnd: () => {},
    touchstart: () => {},
    touchend: () => {},
    clickdown: () => {},
    clickup: () => {},
};

// Listener -> Handler
// user: native: {'mousedown', 'mouseup', etc(keyof GlobalWindowEventMap)} & mixed in root: 'clickdown', 'clickup', onStartEnd, etc
// entity: callBacks

const addListeners = (listeners: ParsedListener[]) => {
    listeners.forEach(listener => {
        createEventListener[listener.type]();
    });
};

const removeListeners = (listeners: ParsedListener[]) => {
    listeners.forEach(listener => {
        //
    });
};

export const createListenerMethods = (listeners: ParsedListener[]) => {
    let enabled = false;

    const add = () => {
        if (enabled) return;

        enabled = true;

        addListeners(listeners);
    };

    const remove = () => {
        if (!enabled) return;

        removeListeners(listeners);

        enabled = false;
    };

    return {add, remove};
};

const err = {
    clickdownconflict: () => {
        throw Error('unable set mousedown or touchstart with clickdown');
    },
    clickupconflict: () => {
        throw Error('unable to set mouseup or touchend with clickup');
    },
};

const throwError = (type: keyof typeof err) => err[type];

const emptyCallBacks = {
    start: () => {},
    startEnd: () => {},
    end: () => {},
    endEnd: () => {},
};
