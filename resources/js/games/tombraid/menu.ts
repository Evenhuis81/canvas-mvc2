/* eslint-disable max-lines-per-function */
import createEntity from 'library/entity';
import type {ConfigOptions, Entity} from 'library/types/entity';

export const mainMenu = () => {
    goToLevelSelection();
};

// Make dynamic with calculatedOptions for resize canvas
// Entity Color can't take in regular css names (like 'red')
// Alter speed 'system' for even faster or slower transitions
// Create oscillerate animation and/or real noise animation
const mainButton: Partial<ConfigOptions> = {
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
    const entity = createEntity('tr');

    const testEntity = entity.create({
        listeners: {
            // mouseup: evt => {
            //     console.log('mouseup', evt.entityEvent.mouseProp);
            // },
            // keyup: evt => {
            //     console.log('keyup', evt.entityEvent.keyProp);
            // },
            // touchstart: evt => {
            //     console.log('touchstart', evt.inputEvent.touches, evt.entityEvent.touchProp);
            // },
            touchmove: evt => {
                console.log('mousemoving');
            },
            // keyup: undefined,
        },
    });

    // const elementAmount = 1;

    // createLevelSelectEntities(elementAmount);
};

// For landscape mode
const createLevelSelectEntities = (amount: number) => {
    const rowsOrColumns = Math.sqrt(amount);
    const paddingY = innerHeight * 0.1;
    const paddingX = innerWidth - (innerHeight - 2 * paddingY);
    const squareLength = (innerHeight - paddingY) / 7; // margin = anything from div/5 - ?
    const squareDistance = (innerHeight - paddingY) / 5;
    const startY = paddingY / 2 + squareLength / 2;
    const startX = paddingX / 2 + squareLength / 2;
    const timeoutDifference = 25;

    const base: Partial<ConfigOptions> = {
        w: squareLength,
        h: squareLength,
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
    };

    const elements: Entity[] = [];

    const entity = createEntity('tr'); // TODO::Put this in resources

    const column = 0;
    const row = 0;
    // for (let i = 0; i < amount; i++) {
    //     elements.push(
    //         entity.create({
    //             ...base,
    //             x: startX + column * squareDistance,
    //             y: startY + row * squareDistance,
    //             text: (i + 1).toString(),
    //             show: false,
    //         }),
    //     );

    // const element = elements[i];

    // element.setHideTime((amount - 1) * timeoutDifference - i * timeoutDifference);

    // element.setListener('clickdown', evt => {
    //     console.log('clickdown User Input triggered');
    //     console.log('mouse or touch event?: ', evt);
    // });

    // element.setListener('clickup', evt => {
    //     console.log('clickup User Input triggered');
    //     console.log('mouse or touch event?: ', evt);
    // });

    // element.setListener('touchend', () => {
    //     element.setVisual('end', 'explode');
    //     // if (clicked) element.setHideTime(0);

    //     elements.forEach(element => element.hide());
    // });

    // element.setListener('endTransitionEnd', clicked => {
    //     if (clicked) {
    //         // element.hide(true); no -> (already hidden)
    //         // element.destroy(); yes

    //         startLevel(i + 1);
    //     }
    // });

    //     setTimeout(() => {
    //         element.show();
    //     }, timeoutDifference * i);

    //     column++;
    //     if (column > rowsOrColumns - 1) {
    //         column = 0;
    //         row++;
    //     }
    // }
};

// Copy from tombraid main menu:
// const entity = createEntity('tr');

// const start = entity.create({...mainButton, show: false});
// const settings = entity.create({...mainButton, y: innerHeight * 0.5, text: 'Settings', show: false});
// const exit = entity.create({...mainButton, y: innerHeight * 0.75, text: 'Exit Game', show: false});

// start.setListener('mouseup', () => {
//     start.hide();
//     settings.hide();
//     exit.hide();
// });

// start.setListener('endTransitionEnd', () => {});
