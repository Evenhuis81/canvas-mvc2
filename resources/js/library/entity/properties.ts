import {Callbacks, EventHandler, GeneralProperties} from 'library/types/entity';

export const createUserMethods = (gProps: GeneralProperties, eventHandler: EventHandler, callbacks: Callbacks) => {
    const show = () => {
        // Should this handle all different scenarios? (showDelay + show + callBack + Input- & EntityListener)
        // Needs refactor for the different kind of options, find way to make this less complex

        // TODO::Add to Library Error
        if (gProps.show) return console.log('show is already active');

        gProps.show = true;

        eventHandler.activateInputListeners();

        callbacks.start.fn();
    };

    const hide = () => {
        // TODO::Add to Library Error/Log
        if (!gProps.show) return console.log('hide trigger while gProps.show = false');

        // Hide delay requires a certain complexity, impelemnt in a later stage, read comment for show

        // if (gProps.hideDelay) {
        //     setTimeout(() => {
        // eventHandler.deactivateInputListeners();

        // hideMe();
        // }, gProps.hideDelay);

        // return;
        // }

        // TODO::Make this an option
        eventHandler.deactivateInputListeners();

        gProps.show = false;

        callbacks.end.fn();
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
