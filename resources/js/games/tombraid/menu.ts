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

    const timeoutDifference = 25;

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
                // listeners: {
                // mouseup: evt => {},
                // touchend: evt => {},
                // keyup: evt => {},
                // startTransitionEnd: evt => {},
                // },
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

        const clicked = () => {
            console.log('clicked element');

            element.setVisual('end', 'explode');

            elements.forEach(el => el.hide());
        };

        element.addNativeListener('touchend', clicked);
        element.addNativeListener('mouseup', clicked);
        // element.addListener('endTransitionEnd', evt => {
        //     console.log(evt.clicked, evt.clickTotal);

        //     console.log(evt);

        //     if (evt.clicked) {
        //         // element.destroy();

        //         // startLevel(i + 1);
        //         console.log(`startLevel(${i + 1})`);
        //     }
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
