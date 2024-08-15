const startSurvival = () => {
    console.log('start game');
};

const createStartMenuButtons = () => {
    for (let i = 0; i < 5; i++) {
        menu.main.buttons.push({
            id: `example${i + 1}`,
            name: `Example${i + 1}`,
            y: innerHeight * (0.3 + i * 0.1),
            w: innerWidth * 0.5,
            fontSize: 20,
            text: `Example #${i + 1}`,
            delayShow: i * 150,
        });

        if (i === 0) menu.main.buttons[i].handlers = {end: () => startSurvival()};
    }
};

interface MenuButtons {
    main: {
        buttons: ButtonOptions[];
    };
}

export const menu: MenuButtons = {
    main: {
        buttons: [],
    },
};

createStartMenuButtons();
