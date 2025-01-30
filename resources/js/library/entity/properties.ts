/* eslint-disable max-lines-per-function */
import {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';

export const createUserMethods = (
    vProps: VisualProperties,
    gProps: GeneralProperties,
    callbacks: Callbacks,
    eventHandler: EventHandler,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !vProps.startTransition) => {
        // TODO::Add to Library Error
        if (gProps.show) console.log('show is already active');

        gProps.show = true;

        // eventHandler.activateInputListeners();

        callbacks.start(quickShow);
    };

    const hide = (quickHide = !vProps.endTransition, hideDelay = gProps.hideDelay) => {
        // TODO::Add to Library Error
        if (!gProps.show) console.log('hide is already active');

        const hideMe = () => {
            gProps.show = false;

            callbacks.end(quickHide);
        };

        if (hideDelay) {
            setTimeout(() => {
                // eventHandler.deactivateInputListeners();

                hideMe();
            }, hideDelay);

            return;
        }

        // eventHandler.deactivateInputListeners();

        hideMe();
    };

    const setHideTime = (time: number) => (gProps.hideDelay = time);

    return {show, hide, setHideTime};
};

export const defaultProperties = {
    // generalProperties (mixed internal properties + id set in abstractOptions)
    name: 'noName', // + counter/uid?
    // type: 'default',
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false, // Also in transitionEventProps
    hideDelay: 0,
    // visualProperties (types can be undefined)
    // animateAtEnd: false,
    // animateAtStart: false,
    startSpeed: 3,
    endSpeed: 3,
};
