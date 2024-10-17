/* eslint-disable max-lines-per-function */
export const createUserEntity = (
    visualProperties: EntityVisualProperties,
    properties: EntityProperties,
    listeners: ListenersHandler,
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
    const setListener: SetUserListener = (type, listener) => {
        const parsedListener = parseListener(type, listener);

        const index = listeners.findIndex(list => list.type === parsedListener.type);

        if (index === -1) {
            listeners.push(parsedListener);

            return;
        }

        listeners[index] = parsedListener;
    };

    return {setListener, listeners};
};

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

// addEventListener

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

export const createListenerHandler = (listeners: ParsedListener[]) => {
    let enabled = false;

    const add = () => {
        if (enabled) return;

        enabled = true;

        addListeners(listeners);
        // addEventListener('mousedown', mousedownListener);
        // addEventListener('mouseup', mouseupListener);
        // addEventListener('touchstart', touchstartListener);
        // addEventListener('touchend', touchendListener);
    };

    const remove = () => {
        if (!enabled) return;

        removeListeners(listeners);
        // removeEventListener('mousedown', mousedownListener);
        // removeEventListener('mouseup', mouseupListener);
        // removeEventListener('touchstart', touchstartListener);
        // removeEventListener('touchend', touchendListener);

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

const throwError2 = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};

// interface MousedownListener {
//     type: 'mousedown';
//     listener: (evt: EntityEvent<MouseEvent>) => void;
// }

// interface TouchstartListener {
//     type: 'touchstart';
//     listener: (evt: EntityEvent<TouchEvent>) => void;
// }

// type ListenerTypes = 'mousedown' | 'touchstart';

// type Listeners = MousedownListener | TouchstartListener;

// const createListtener = <K extends Listeners['type']>(key: K, listener: Listeners['listener']) => {
//     if (key === 'mousedown') {
//         const tt = {type: key, listener}
//     }
// }

// const testListeners: Partial<UserListeners> = {
//     mousedown: () => {},
//     touchstart: () => {},
// }

// let key: ListenerTypes;
// for (const key in testListeners) {
//     const testList = userListeners[key];
//     if (testList)
//     const listt = createListtener(key, testListeners[key]);
//         listeners.push({
//             type: key,
//             listener: testList,
//         });
// }

// const mousedownListener = (evt: MouseEvent) => {
//     if (mouse.insideRect(sketch)) {
//         if (clickdown) clickdown({clicked: properties.clicked, evt});
//         if (mousedown) mousedown({clicked: properties.clicked, evt});
//     }
// };

// const mouseupListener = (evt: MouseEvent) => {
//     // statistic release counter (inside or outside), can be used to check clicked (to remove clicked property)
//     if (mouse.insideRect(sketch)) {
//         properties.clicked = true;

//         mouseup({clicked: properties.clicked, evt});

//         // See below comments, until done, choose mouse or touch to call usermethod
//         userListeners.clickup({clicked: properties.clicked, evt});
//     }
// };

// // To call 1 method for userListener and send both mouse and touch events on 'click', requires 1st line method TODO
// const touchstartListener = (evt: TouchEvent) => {
//     if (touch.insideRect(sketch)) {
//         properties.clicked = true;

//         userListeners.touchstart({clicked: properties.clicked, evt});
//     }
// };

// const touchendListener = (evt: TouchEvent) => {
//     if (touch.insideRect(sketch)) {
//         properties.clicked = true;

//         userListeners.touchend({clicked: properties.clicked, evt});
//     }
// };
