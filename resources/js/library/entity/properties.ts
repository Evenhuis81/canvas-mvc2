/* eslint-disable max-lines-per-function */
import {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';

export const createUserMethods = (
    vProps: VisualProperties,
    gProps: GeneralProperties,
    callbacks: Callbacks,
    eventHandler: EventHandler,
) => {
    // parameter default gives auto start (and end) transitions if type !undefined, manually able to set by user input
    const show = (quickShow = !vProps.startType) => {
        // TODO::Add to Error/Log Handling module
        if (gProps.show) throw Error('show is already active');

        gProps.show = true;

        // console.log(eventHandler);
        eventHandler.activateListeners();

        callbacks.start(quickShow);
    };

    const hide = (quickHide = !vProps.endType, hideTime = gProps.hideTime) => {
        // TODO::Add to Error Handling module
        if (!gProps.show) throw Error('hide is already active');

        const hideMe = () => {
            gProps.show = false;

            callbacks.end(quickHide);
        };

        if (hideTime) {
            setTimeout(() => {
                eventHandler.deactivateListeners();

                hideMe();
            }, hideTime);

            return;
        }

        eventHandler.deactivateListeners();

        hideMe();
    };

    const setHideTime = (time: number) => (gProps.hideTime = time);

    return {show, hide, setHideTime};
};

export const defaultProperties = {
    // generalProperties (mixed internal properties + id set in abstractOptions)
    name: 'noName', // + counter/uid?
    // type: 'default',
    disabled: false,
    show: true,
    showDelay: 0,
    clicked: false,
    hideTime: 0,
    // visualProperties (types can be undefined)
    animateAtStart: false,
    animateAtEnd: false,
    startSpeed: 3,
    endSpeed: 3,
};
