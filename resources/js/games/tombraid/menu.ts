/* eslint-disable max-lines-per-function */
import type {Entity, VisualProperties} from 'library/types/entity';
import type {LibraryResources} from 'library/types';
import type {ShapesConfig} from 'library/types/shapes';

const elementAmount = 9;

export const mainMenu = (library: LibraryResources) => {
    const rowsOrColumns = Math.sqrt(elementAmount);

    const paddingY = innerHeight * 0.1;
    const paddingX = innerWidth - (innerHeight - 2 * paddingY);

    const squareLength = (innerHeight - paddingY) / 7; // margin = anything from div/5 - ?
    const squareDistance = (innerHeight - paddingY) / 5;

    const startY = paddingY / 2 + squareLength / 2;
    const startX = paddingX / 2 + squareLength / 2;

    const timeoutDifference = 75;

    const baseSketch: ShapesConfig = {
        type: 'rect',
        w: squareLength,
        h: squareLength,
    };
    const baseVisualProperties: Partial<VisualProperties> = {
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
    };

    const elements: Entity[] = [];

    let column = 0;
    let row = 0;

    for (let i = 0; i < elementAmount; i++) {
        elements.push(
            library.createEntity({
                ...baseVisualProperties,
                show: false,
                sketch: {
                    ...baseSketch,
                    x: startX + column * squareDistance,
                    y: startY + row * squareDistance,
                    text: (i + 1).toString(),
                },
                listeners: {
                    mouseup: undefined,
                    // mouseup: evt => {
                    //     console.log(`Mouse UP: ${i}`, evt);
                    // },
                    touchend: evt => {
                        console.log(`Touch END: ${i}`, evt);
                    },
                    startTransition: evt => {
                        console.log(`Start Transition: ${i}`, evt);
                    },
                    finishTransition: evt => {
                        console.log(`Finish Transition: ${i}`, evt);
                    },
                },
            }),
        );

        const element = elements[i];

        element.setHideTime((elementAmount - 1) * timeoutDifference - i * timeoutDifference);

        setTimeout(() => {
            element.show();
        }, timeoutDifference * i);

        column++;
        if (column > rowsOrColumns - 1) {
            column = 0;
            row++;
        }

        // const clicked = (evt: TouchEvent | MouseEvent) => {
        //     console.log('Clicked element: ');

        //     console.log(`clicked element ${i + 1} (index + 1), event:`, evt);

        //     element.setVisual('end', 'explode');

        //     elements.forEach(el => el.hide());
        // };

        // element.removeListener('mouseup');

        element.addListener('mouseup', evt => {
            console.log(`Mouse UP: ${i}`, evt);
        });
        // element.addListener('touchend', clicked);
        // element.addListener('mouseup', clicked);
        // element.addListener('finishTransition', evt => {
        //     console.log(`finish Transition: ${evt}`);
        //     //     if (evt.clicked) {
        //     //         // element.destroy();
        //     //         // startLevel(i + 1);
        //     //         console.log(`startLevel(${i + 1})`);
        //     //     }
        // });
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
