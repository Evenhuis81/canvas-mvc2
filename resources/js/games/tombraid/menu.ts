import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const mainMenu = () => {
    // Copy from tombraid main menu:
    // Start Casual Game
    // Settings
    // Exit Game

    const entity = createEntity('tr');

    const start = entity.create(mainButton);
    const settings = entity.create({...mainButton, y: innerHeight * 0.5, text: 'Settings'});
    const exit = entity.create({...mainButton, y: innerHeight * 0.75, text: 'Exit Game'});

    start.setListener('mouseup', () => {
        start.hide();
        settings.hide();
        exit.hide();
    });

    start.setListener('endTransitionEnd', () => {
        console.log('level screen');
    });
};

// Make dynamic with calculatedOptions for resize canvas
// Entity Color can't take in regular css names (like 'red')
// Create superfast fadein fadeout (more speeds)
// Create oscillerate animation and / or real noise one

const mainButton: Partial<EntityConfig> = {
    startType: 'fadein1',
    startSpeed: 5,
    endType: 'fadeout1',
    endSpeed: 5,
    x: innerWidth * 0.5,
    y: innerHeight * 0.25,
    w: 400,
    h: 80,
    text: 'Start Game',
    r: 20,
    lw: 10,
    stroke: '#ff9900',
    fill: '#000',
    textFill: '#f00',
    fontSize: 64,
};

export const goToMenu = () => {
    const buttons = createLevelButtons(5);

    const entity = createEntity('tr');

    const entities: UserEntity[] = [];

    buttons.forEach(button => entities.push(entity.create(button)));

    entities[0].setListener('mouseup', () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                entities[i].hide();
            }, i * 200);
        }
    });

    entities[0].setListener('endTransitionEnd', () => {
        startLevel(3);
    });
};

const createLevelButtons = (amount: number) => {
    const heightDif = 70;
    const delayDif = 200;

    const base: Partial<EntityConfig> = {
        x: 80,
        y: 50,
        text: 'Entity #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
        showDelay: 0,
    };

    const buttons: (typeof base)[] = [];

    for (let i = 0; i < amount; i++) {
        base.y = 50 + i * heightDif;
        base.text = `Entity #${i + 1}`;
        base.showDelay = delayDif * i;

        buttons.push({...base});
    }

    return buttons;
};
