/* eslint-disable max-lines-per-function */
import {startLevel} from './initiatize';
import createEntity from 'library/entity';

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

    createLevelSelectEntities(elementAmount);
};

const createLevelSelectEntities = (amount: number) => {
    // console.log(innerWidth, innerHeight); // Put in statistics for easy view

    // For landscape mode
    const rowsOrColumns = Math.sqrt(amount);
    const paddingY = innerHeight * 0.1;
    const paddingX = (innerWidth - (innerHeight - 2 * paddingY)) / 2;
    const elDist = innerHeight - (paddingY * 2) / rowsOrColumns; // TODO::Set element distance
    // const squareLength = heightDif / 2;
    // console.log(heightDif);
    const timeoutDif = 25;

    const base: Partial<EntityConfig> = {
        // w: squareLength,
        // h: squareLength,
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
    };

    const elements: UserEntity[] = [];

    const entity = createEntity('tr'); // TODO::Put this in resources

    let column = 1;
    let row = 1;
    for (let i = 0; i < amount; i++) {
        elements.push(
            entity.create({...base, x: column * heightDif, y: row * heightDif, text: (i + 1).toString(), show: false}),
        );

        const element = elements[i];

        element.setHideTime((amount - 1) * timeoutDif - i * timeoutDif);

        element.setListener('mouseup', () => {
            // if (clicked) element.setAnimationProperty('endTransitionStart');
            // if (clicked) element.setHideTime(0);
            elements.forEach(element => element.hide());
        });

        element.setListener('endTransitionEnd', () => {
            console.log('endTransitionEnd', i);
            // if (clicked) startLevel(i + 1);
        });

        setTimeout(() => {
            element.show();
        }, timeoutDif * i);

        column++;
        if (column > rowsOrColumns) {
            column = 1;
            row++;
        }
    }
};
