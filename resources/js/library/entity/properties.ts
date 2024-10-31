import {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';

/* eslint-disable max-lines-per-function */
export const createUserMethods = (
    vProps: VisualProperties,
    gProps: GeneralProperties,
    callbacks: Callbacks,
    eventHandler: EventHandler,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !vProps.startType) => {
        // Make throwError (general and easie to use)
        if (gProps.show) throw Error('show is already active');

        gProps.show = true;

        eventHandler.addListeners();

        callbacks.start(quickShow);
    };

    const hide = (quickHide = !vProps.endType, hideTime = gProps.hideTime) => {
        if (!gProps.show) throw Error('hide is already active');

        const hideMe = () => {
            gProps.show = false;

            callbacks.end(quickHide);
        };

        if (hideTime) {
            setTimeout(() => {
                eventHandler.removeListeners();

                hideMe();
            }, hideTime);

            return;
        }

        eventHandler.removeListeners();

        hideMe();
    };

    const setHideTime = (time: number) => (gProps.hideTime = time);

    return {show, hide, setHideTime};
};
