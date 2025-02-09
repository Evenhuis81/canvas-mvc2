import {EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';

export const createUserMethods = (
    vProps: Partial<VisualProperties>,
    gProps: GeneralProperties,
    eventHandler: EventHandler,
) => {
    const show = () => {
        // Should this handle all different scenarios? (showDelay + show + callBack + Input- & EntityListener)

        // TODO::Add to Library Error
        if (gProps.show) return console.log('show is already active');

        gProps.show = true;

        // TODO::Make this an option
        eventHandler.activateInputListeners();

        // callbacks.start(quickShow);
    };

    const hide = () => {
        // TODO::Add to Library Error/Log
        if (!gProps.show) return console.log('hide trigger while gProps.show = false');

        // const hideMe = () => {
        // gProps.show = false;

        // callbacks.end(quickHide);
        // };

        if (gProps.hideDelay) {
            setTimeout(() => {
                // eventHandler.deactivateInputListeners();
                // hideMe();
            }, gProps.hideDelay);

            // return;
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
