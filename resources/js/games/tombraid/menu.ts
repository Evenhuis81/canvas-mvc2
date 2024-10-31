/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import createEntity from 'library/entity';
import type {ConfigOptions, Entity} from 'library/types/entity';

export const mainMenu = () => {
    // const entity = createEntity('tr');
    // const b = entity.create(mainButton);

    goToLevelSelection();
};

export const goToLevelSelection = () => {
    const entity = createEntity('tr');

    const elementAmount = 25;

    createLevelSelectEntities(elementAmount, entity);
};

// For landscape mode
const createLevelSelectEntities = (amount: number, entity: {create: (options?: ConfigOptions) => Entity}) => {
    const rowsOrColumns = Math.sqrt(amount);
    const paddingY = innerHeight * 0.1;
    const paddingX = innerWidth - (innerHeight - 2 * paddingY);
    const squareLength = (innerHeight - paddingY) / 7; // margin = anything from div/5 - ?
    const squareDistance = (innerHeight - paddingY) / 5;
    const startY = paddingY / 2 + squareLength / 2;
    const startX = paddingX / 2 + squareLength / 2;
    const timeoutDifference = 25;

    const base: ConfigOptions = {
        w: squareLength,
        h: squareLength,
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
    };

    const elements: Entity[] = [];

    let column = 0;
    let row = 0;

    for (let i = 0; i < amount; i++) {
        elements.push(
            entity.create({
                ...base,
                x: startX + column * squareDistance,
                y: startY + row * squareDistance,
                text: (i + 1).toString(),
                show: false,
            }),
        );

        const element = elements[i];

        element.setHideTime((amount - 1) * timeoutDifference - i * timeoutDifference);

        setTimeout(() => {
            element.show();
        }, timeoutDifference * i);

        column++;
        if (column > rowsOrColumns - 1) {
            column = 0;
            row++;
        }

        const clicked = evt => {
            console.log(evt);
            element.setVisual('end', 'explode');

            elements.forEach(el => el.hide());
        };

        element.setListener('touchend', clicked);
        element.setListener('mouseup', clicked);
        element.setListener('endTransitionEnd', evt => {
            console.log(evt.clicked, evt.clickTotal);
            // console.log(evt.clicked, evt.clickTotal);
            // if (clicked) {
            // element.hide(true); no -> (already hidden)
            // element.destroy(); yes
            // startLevel(i + 1);
            // }
        });
    }
};

// Make dynamic with calculatedOptions for resize canvas
// Entity Color can't take in regular css names (like 'red')
// Alter speed 'system' for even faster or slower transitions
// Create oscillerate animation and/or real noise animation

// const mainButton: Partial<ConfigOptions> = {
//     startType: 'fadein1',
//     startSpeed: 5,
//     endType: 'fadeout1',
//     endSpeed: 5,
//     x: innerWidth * 0.5,
//     y: innerHeight * 0.25,
//     w: 400,
//     h: 80,
//     text: 'Start Game',
//     r: 20,
//     lw: 10,
//     stroke: '#ff9900',
//     fill: '#000',
//     textFill: '#f00',
//     fontSize: 64,
// };
