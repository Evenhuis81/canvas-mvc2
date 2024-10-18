import {EntityListener, ParseListener, UserListeners} from 'library/types/entity';

/* eslint-disable max-lines-per-function */
export const createUserMethods = (
    vProps: VisualProperties,
    props: GeneralProperties,
    listeners: ListenerHandler,
    callbacks: EntityCallbacks,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !vProps.startType) => {
        // Make throwError more general and easier to use (less parameters)
        if (props.show) throw Error('show is already active');
        // throwError(props.id, 'showing');

        props.show = true;

        listeners.add();

        callbacks.start(quickShow);
    };

    const hide = (quickHide = !vProps.endType, hideTime = props.hideTime) => {
        if (!props.show) throw Error('hide is already active');
        // throwError(props.id, 'hiding');

        const hideMe = () => {
            props.show = false;

            listeners.remove();

            callbacks.end(quickHide);
        };

        if (hideTime) {
            setTimeout(() => {
                hideMe();
            }, hideTime);

            return;
        }

        hideMe();
    };

    const setHideTime = (time: number) => (props.hideTime = time);

    return {show, hide, setHideTime};
};
