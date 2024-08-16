const startSurvival = () => {
    console.log('start game');
};

// const createStartMenuButtons = () => {
//     for (let i = 0; i < 5; i++) {
export const startButton = {
    id: `example${1}`,
    name: `Example${1}`,
    y: innerHeight * 0.5,
    w: innerWidth * 0.5,
    fontSize: 20,
    text: `Example #${1}`,
    delayShow: 150,
    click: {
        up: () => startSurvival(),
    },
};
//     }
// };
