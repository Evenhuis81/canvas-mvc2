/* eslint-disable max-lines-per-function */
import {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';

export const createUserMethods = (
    vProps: Partial<VisualProperties>,
    gProps: GeneralProperties,
    callbacks: Callbacks,
    eventHandler: EventHandler,
) => {
    const show = () => {
        // TODO::Add to Library Error
        if (gProps.show) console.log('show is already active');

        gProps.show = true;

        // eventHandler.activateInputListeners();

        // callbacks.start(quickShow);
    };

    const hide = () => {
        // TODO::Add to Library Error/Log
        if (!gProps.show) console.log('hide trigger while gProps.show = false');

        // const hideMe = () => {
        // gProps.show = false;

        // callbacks.end(quickHide);
        // };

        if (gProps.hideDelay) {
            setTimeout(() => {
                // eventHandler.deactivateInputListeners();
                // hideMe();
            }, gProps.hideDelay);

            return;
        }

        // eventHandler.deactivateInputListeners();

        // hideMe();
    };

    const setHideTime = (time: number) => (gProps.hideDelay = time);

    return {show, hide, setHideTime};
};

export const defaultProperties = {
    // generalProperties (mixed internal properties + id set in abstractOptions)
    name: 'noName', // + counter/uid?
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false, // Also in transitionEventProps
    hideDelay: 0,
    // visualProperties (types can be undefined)
    // animateAtEnd: false,
    // animateAtStart: false,
    // startSpeed: 3,
    // endSpeed: 3,
};
