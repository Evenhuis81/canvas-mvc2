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
    }
};

export const menu: MenuButtons = {
    main: {
        buttons: [],
        handlers: [],
    },
};

menu.main.handlers[4].up = () => {
    startSurvival();
};

createStartMenuButtons();

interface MenuButtons {
    main: {
        buttons: Omit<ButtonOptions, 'click' | 'colors'>[];
        handlers: Required<ButtonHandlers>[];
    };
}
