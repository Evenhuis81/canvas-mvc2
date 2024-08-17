const startSurvival = () => {
    console.log('start game');
};

export const startButton = {
    id: `tart${1}`,
    name: `Start${1}`,
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
    text: `Start Game`,
    delayShow: 0,
    click: {
        up: () => startSurvival(),
    },
};
