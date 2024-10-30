import {Callbacks, GeneralProperties, VisualProperties} from 'library/types/entity';

/* eslint-disable max-lines-per-function */
export const createUserMethods = (
    vProps: VisualProperties,
    gProps: GeneralProperties,
    callbacks: Callbacks,
    addListeners: () => void,
    removeListeners: () => void,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !vProps.startType) => {
        // Make throwError more general and easier to use (less parameters)
        if (gProps.show) throw Error('show is already active');
        // throwError(props.id, 'showing');

        gProps.show = true;

        addListeners();

        callbacks.start(quickShow);
    };

    const hide = (quickHide = !vProps.endType, hideTime = gProps.hideTime) => {
        if (!gProps.show) throw Error('hide is already active');
        // throwError(gProps.id, 'hiding');

        const hideMe = () => {
            gProps.show = false;

            removeListeners();

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

    const setHideTime = (time: number) => (gProps.hideTime = time);

    return {show, hide, setHideTime};
};
