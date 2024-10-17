/* eslint-disable max-lines-per-function */
export const createUserEntity = ({visualProperties, properties, listeners, callBacks}: Entity) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !visualProperties.startType) => {
        // Make throwError more general and easier to use (less parameters)
        if (properties.show) throwError(properties.id, 'showing');

        properties.show = true;

        listeners.add();

        callBacks.start(quickShow);
    };

    const hide = (quickHide = !visualProperties.endType, hideTime = properties.hideTime) => {
        if (!properties.show) throwError(properties.id, 'hiding');

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

const createUserListeners = (userListeners: Partial<UserListeners> = {}) => {
    const setListener: SetUserListener = (type, listener) => (userListeners[type] = listener); // User input handlers after creation

    return {setListener, userListeners};
};

export const createListeners = (
    sketch: EntitySketch,
    userListeners: UserListeners,
    properties: EntityProperties,
    {mouse, touch}: Input,
) => {
    const listeners: ReturnType<typeof createEntityListener>[] = [];
    let enabled = false;

    type EntityListener<K extends keyof UserListeners, L extends UserListeners[K] | undefined> =
        | {
              type: K;
              listener: NonNullable<L>;
          }
        | undefined;

    type CreateEntityListener = <K extends keyof UserListeners, L extends UserListeners[K] | undefined>(
        key: K,
        listener: L,
    ) => EntityListener<K, L>;

    let key: keyof UserListeners;
    for (key in userListeners) {
        listeners.push(createEntityListener(key, userListeners[key]));
    }

    listeners.forEach(listenerr => {
        //
    });

    interface MousedownListener {
        type: 'mousedown';
        listener: (evt: EntityEvent<MouseEvent>) => void;
    }

    interface TouchstartListener {
        type: 'touchstart';
        listener: (evt: EntityEvent<TouchEvent>) => void;
    }

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

    // const createListener = {
    //     mouseup: () => {},
    //     mousedown: () => {},
    //     startTransitionEnd: () => {},
    //     endTransitionEnd: () => {},
    //     touchstart: () => {},
    //     touchend: () => {},
    //     clickdown: () => {},
    //     clickup: () => {},
    // };

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

    // type UserListener = {
    //     type: keyof UserListeners;
    //     listener: (evt: EntityEvent<MouseEvent | TouchEvent>) => void;
    // };
    // ReturnType<typeof createEntityListener>[] = [];

    //     const createEntityListener = <K extends keyof UserListeners, L extends UserListeners[K] | undefined>(
    //         key: K,
    //         listener: L,
    //     )

    // {type: K; listener?: UserListeners[K]};

    const add = () => {
        if (enabled) return;

        enabled = true;

        // addEventListener('mousedown', mousedownListener);
        // addEventListener('mouseup', mouseupListener);
        // addEventListener('touchstart', touchstartListener);
        // addEventListener('touchend', touchendListener);
    };

    const remove = () => {
        if (!enabled) return;

        // removeEventListener('mousedown', mousedownListener);
        // removeEventListener('mouseup', mouseupListener);
        // removeEventListener('touchstart', touchstartListener);
        // removeEventListener('touchend', touchendListener);

        enabled = false;
    };

    return {add, remove};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
