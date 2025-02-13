/* eslint-disable max-lines-per-function */
import type {EntityGeneric, VisualProperties} from 'library/types/entity';
import type {LibraryResources} from 'library/types';

const elementAmount = 25;

export const mainMenu = (library: LibraryResources) => {
    // const cc = library.createEntity('rect1');

    // cc.sketch.colors.

    const rowsOrColumns = Math.sqrt(elementAmount);

    const paddingY = innerHeight * 0.1;
    const paddingX = innerWidth - (innerHeight - 2 * paddingY);

    const squareLength = (innerHeight - paddingY) / 7; // margin = anything from div/5 - ?
    const squareDistance = (innerHeight - paddingY) / 5;

    const startY = paddingY / 2 + squareLength / 2;
    const startX = paddingX / 2 + squareLength / 2;

    const timeoutDifference = 75;

    const baseVisualProperties: Partial<VisualProperties> = {
        start: 'fadein1',
        startSpeed: 5,
        end: 'fadeout1',
        endSpeed: 5,
    };

    const elements: EntityGeneric<'button1'>[] = [];

    let column = 0;
    let row = 0;

    for (let i = 0; i < elementAmount; i++) {
        elements.push(
            library.createEntity('button1', {
                ...baseVisualProperties,
                show: false,
                showDelay: i * timeoutDifference,
                sketch: {
                    // type: 'optional', // 'circle1' | 'rect1' | 'button1'
                    x: startX + column * squareDistance,
                    y: startY + row * squareDistance,
                    w: squareLength,
                    h: squareLength,
                    // radius: 5,
                    radii: 25,
                    fill: '#000',
                    stroke: '#00f',
                    lineWidth: 1,
                    fontSize: 24,
                    textFill: '#fff',
                    text: (i + 1).toString(),
                    // font: '',
                    // textAlign: 'center',
                    // textBaseLine: 'alphabetic',
                    // radius: 8,
                },
                listeners: {
                    mouseup: evt => {
                        console.log(`Mouse UP: ${i}`, evt);
                    },
                    touchend: evt => {
                        console.log(`Touch END: ${i}`, evt);
                    },
                    startTransition: evt => {
                        console.log(`Start Transition: ${i}`, evt);
                    },
                    endOfStartTransition: evt => {
                        console.log(`End Of Start Transition: ${i}`, evt);
                    },
                    endTransition: evt => {
                        console.log(`End Transition: ${i}`, evt);
                    },
                    endOfEndTransition: evt => {
                        console.log(`End of End Transition: ${i}`, evt);
                    },
                },
            }),
        );

        // const element = elements[i];

        // element.setHideTime((elementAmount - 1) * timeoutDifference - i * timeoutDifference);

        // setTimeout(() => {
        //     element.show();
        // }, timeoutDifference * i);

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

        // element.addListener('mouseup', evt => {
        //     console.log(`Mouse UP: ${i}`, evt);
        // });
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
//     startTransition: 'fadein1',
//     startSpeed: 5,
//     endTransition: 'fadeout1',
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
