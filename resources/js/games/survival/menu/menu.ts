import button from 'library/button/button';

const startSurvival = () => {
    console.log('start game');
};

const startButton: ButtonOptions = {
    id: 'start',
    name: 'Start Button',
    y: innerHeight * 0.3,
    w: innerWidth * 0.3,
    fontSize: 20,
    text: 'Start #',
    click: {
        down: evt => {
            //
        },
        up: evt => {
            button.endAll(startButton.id);
        },
        end: evt => {
            evt.selfDestruct();

            startSurvival();
        },
    },
};

const startButton2: ButtonOptions = {
    id: 'start2',
    name: 'Start Button2',
    y: innerHeight * 0.4,
    w: innerWidth * 0.4,
    fontSize: 20,
    text: 'Start #2',
    click: {
        end: evt => {
            // evt.selfDestruct();
        },
    },
};

const startButton3: ButtonOptions = {
    id: 'start3',
    name: 'Start Button3',
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
    text: 'Start #3',
    click: {
        end: evt => {
            // evt.selfDestruct();
        },
    },
};

const startButton4: ButtonOptions = {
    id: 'start4',
    name: 'Start Button4',
    y: innerHeight * 0.6,
    w: innerWidth * 0.4,
    fontSize: 20,
    text: 'Start #4',
    click: {
        end: evt => {
            // evt.selfDestruct();
        },
    },
};

const startButton5: ButtonOptions = {
    id: 'start5',
    name: 'Start Button5',
    y: innerHeight * 0.7,
    w: innerWidth * 0.3,
    fontSize: 20,
    text: 'Start #5',
    click: {
        end: evt => {
            // evt.selfDestruct();
        },
    },
};

export const menu = {
    main: {
        buttons: [startButton, startButton2, startButton3, startButton4, startButton5],
    },
};
