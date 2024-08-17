const startSurvival = () => {
    console.log('start game');
};

export const startButton = {
    id: 'start',
    name: 'Start',
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
    text: 'Start',
    delayShow: 1000,
    click: {
        up: () => startSurvival(),
    },
};

export const calculatedButton = () => ({
    id: 'start',
    name: 'Start',
    x: innerWidth * 0.5,
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
    text: 'Start',
    delayShow: 1000,
    click: {
        up: () => startSurvival(),
    },
});
