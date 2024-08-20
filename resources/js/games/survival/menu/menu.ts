import {levelScreen} from '../level/level-select';

export const startButton = {
    id: 'start',
    name: 'Start Button',
    text: 'Select Level',
    delayShow: 1000,
    click: {
        end: () => levelScreen(),
    },
};

// Instead of calculated, let this 'auto-resize' according to the right keys on the object (Union Types?)
// This could also be used as an option, when calucatedButton does not get passed into the method (optional parameter), it won't
// trigger a resize event on resize window. (?)
export const calculatedStartButton = () => ({
    x: innerWidth * 0.5,
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
});
