import {initialize} from 'library/index';
import {createCharacter} from './character';
import {createLevelDraw, getLevel} from './level';
import {LibraryOptions} from 'library/types';
// import type {CreateElement} from 'library/entity';
// import type {ShapeMap} from 'library/entity/defaults/shapes';
// import type {Engine} from 'library/types/engine';

const libraryID = 'reverse';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
    dotMiddle: true,
};

export type WorldProperties = {
    xUnits: number;
    yUnits: number;
    xOffset: number;
    yOffset: number;
    xSpeed: number;
    ySpeed: number;
    xMargin: number;
    yMargin: number;
    unitScale: number; // unitLength & unitHeight is the same
    display: 'portrait' | 'landscape';
};

const world: WorldProperties = {
    xUnits: 16,
    yUnits: 9,
    xOffset: 0,
    yOffset: 0,
    xSpeed: 0.002,
    ySpeed: 0,
    xMargin: 0,
    yMargin: 0,
    unitScale: 0,
    display: 'portrait',
};

const setScreen = (canvas: HTMLCanvasElement) => {
    world.unitScale = canvas.width / world.xUnits;

    if (canvas.width > canvas.height) {
        world.display = 'portrait';

        world.yMargin = (canvas.height - world.unitScale * world.yUnits) / 2;

        return;
    }

    world.display = 'landscape';

    world.xMargin = (canvas.width - world.unitScale * 16) / 2;
};

export default () => {
    const library = initialize(libraryID, libraryOptions);
    const {canvas, context, engine, entity, input} = library;

    setScreen(canvas);

    const level = getLevel(1);

    const levelDraw = createLevelDraw(context, world, level);

    const {
        draw: charDraw,
        update: charUpdate,
        char: charProps,
        pos: charPos,
    } = createCharacter(world, context, canvas, level);

    const levelUpdate = () => {
        // world.xOffset -= world.xSpeed * 2;
    };

    engine.setUpdate({fn: levelUpdate});
    engine.setUpdate(charUpdate);

    engine.setDraw(levelDraw);
    engine.setDraw(charDraw);

    // showStats(charProps, world, entity.create, engine);

    engine.setUpdate({
        fn: () => {
            if (input.keyboard.keyHeld['ArrowLeft']) world.xOffset -= 0.005;
        },
    });

    library.runEngine();
};

// const showStats = (
//     charProps: {scaledW: number; scaledH: number; scaledX: number; scaledY: number; pos: {x: number; y: number}},
//     world: WorldProperties,
//     createElement: CreateElement<ShapeMap>,
//     engine: Engine,
// ) => {
// const cc = createElement('circle', {
//     x: charProps.scaledX + charProps.scaledW / 2 + world.unitScale,
//     y: charProps.scaledY + charProps.scaledH / 2 + 1,
//     r: 5,
//     fill: '#f66',
// });
// const tt = createElement('text', {
//     text: `scaledX: ${charProps.scaledX}, scaledY: ${charProps.scaledY}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const tt2 = createElement('text', {
//     text: `X: ${charProps.pos.x}, Y: ${charProps.pos.y}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2 + 15,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const tt3 = createElement('text', {
//     text: `levelCharacter: ${level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x)]}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2 - 15,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const ttE = createElement('text', {text: `world offset X: ${world.xOffset.toFixed(2)}`, textAlign: 'start'});
// const ttEE = createElement('text', {
//     text: `level char: ${level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x - world.xOffset)]}`,
//     textAlign: 'start',
//     y: 25,
// });
// engine.setUpdate({
//     fn: () => {
//         tt.sketch.text = `scaledX: ${charProps.scaledX.toFixed(2)}, scaledY: ${charProps.scaledY.toFixed(2)}`;
//         ttE.sketch.text = `world Offset X: ${world.xOffset.toFixed(2)}`;
//         ttEE.sketch.text = `level char: ${
//             level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x - world.xOffset)]
//         }`;
//         tt2.sketch.text = `X: ${charProps.pos.x.toFixed(1)}, Y: ${charProps.pos.y.toFixed(1)}`;
//         cc.sketch.x = charProps.scaledX + world.unitScale;
//         cc.sketch.y = charProps.scaledY + world.unitScale;
//         tt.sketch.x = charProps.scaledX;
//         tt.sketch.y = charProps.scaledY;
//         tt2.sketch.x = charProps.scaledX;
//         tt2.sketch.y = charProps.scaledY + 15;
//     },
// });
// cc.show();
// tt.show();
// tt2.show();
// ttE.show();
// ttEE.show();
// };
