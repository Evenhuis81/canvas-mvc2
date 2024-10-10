import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const mainMenu = () => {
    // Copy from tombraid main menu:
    const entity = createEntity('tr');

    const start = entity.create({...mainButton, show: false});
    const settings = entity.create({...mainButton, y: innerHeight * 0.5, text: 'Settings', show: false});
    const exit = entity.create({...mainButton, y: innerHeight * 0.75, text: 'Exit Game', show: false});

    start.setListener('mouseup', () => {
        start.hide();
        settings.hide();
        exit.hide();
    });

    start.setListener('endTransitionEnd', () => {});

    goToLevelSelection();
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

export const goToLevelSelection = () => {
    const elementAmount = 25;
    const delayDifference = 50;

    const entities = createLevelSelectEntities(elementAmount, delayDifference);

    // entities[0].setListener('mouseup', () => {
    //     for (let i = 0; i < elementAmount; i++) {
    //         setTimeout(() => {
    //             entities[i].hide();
    //         }, i * fadeInSpeed);
    //     }
    // });

    // entities[0].setListener('endTransitionEnd', () => {
    //     startLevel(3);
    // });
};

const createLevelSelectEntities = (amount: number, delayDif: number) => {
    const rowsOrColumns = Math.sqrt(amount);
    const widthDif = (innerWidth - innerWidth * 0.1) / rowsOrColumns;
    const heightDif = (innerHeight - innerHeight * 0.2) / rowsOrColumns;
    const squareLength = innerWidth / (rowsOrColumns * 3);

    const base: Partial<EntityConfig> = {
        w: squareLength,
        h: squareLength,
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
    };

    const elements: UserEntity[] = [];

    // TODO::Put this in resources
    const entity = createEntity('tr');

    let column = 1;
    let row = 1;
    for (let i = 0; i < amount; i++) {
        elements.push(entity.create({...base, x: column * widthDif, y: row * heightDif, text: (i + 1).toString()}));

        elements[i].setListener('mouseup', () => {
            elements.forEach(element => element.hide());
        });

        type EntEvt = {
            clicked: boolean;
        };

        elements[i].setListener('endTransitionEnd', (entityEvent: EntEvt) => {
            if (entityEvent.clicked) startLevel(i + 1);
        });

        column++;
        if (column > rowsOrColumns) {
            column = 1;
            row++;
        }
    }

    return elements;
};
