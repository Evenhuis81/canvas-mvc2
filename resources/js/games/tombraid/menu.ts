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
    // const delayDifference = 25;

    createLevelSelectEntities(elementAmount);

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

const createLevelSelectEntities = (amount: number) => {
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
        elements.push(
            entity.create({...base, x: column * widthDif, y: row * heightDif, text: (i + 1).toString(), show: false}),
        );

        const tis = elements[i];

        tis.setHideTime((amount - 1) * 25 - i * 25);

        tis.setListener('mouseup', (evt, clicked) => {
            // if (clicked) tis.setAnimationProperty('endTransitionStart');
            if (clicked) tis.setHideTime(0);

            elements.forEach(element => element.hide());
        });

        tis.setListener('endTransitionEnd', clicked => {
            if (clicked) startLevel(i + 1);
        });

        setTimeout(() => {
            tis.show();
        }, 25 * i);

        column++;
        if (column > rowsOrColumns) {
            column = 1;
            row++;
        }
    }

    // return elements;
};
