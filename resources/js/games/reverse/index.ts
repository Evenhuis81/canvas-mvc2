import {initialize} from 'library/index';
import {createCharacter} from './character';
import {ReverseLevel, createLevelDraw, getLevel} from './level';
import type {LibraryOptions} from 'library/types';
import type {CreateElement} from 'library/entity';
import type {ShapeMap} from 'library/entity/defaults/shapes';
import type {Engine} from 'library/types/engine';
import {Pos} from 'library/types/shapes';
import {LibraryInput} from 'library/types/input';

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

    input.addMovement('reverse', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], charPos, charProps);

    // engine.setUpdate({fn: () => {
    // world.xOffset -= world.xSpeed * 2;
    // }});

    // engine.setUpdate(charUpdate);

    engine.setUpdate({
        fn: () => {
            charProps.scaledX = charPos.x * world.unitScale;
            charProps.scaledY = charPos.y * world.unitScale;
        },
    });

    engine.setDraw(levelDraw);
    engine.setDraw(charDraw);

    showStats(Object.assign(charProps, {pos: charPos}), world, entity.create, engine, canvas, level);

    // engine.setUpdate({
    //     fn: () => {
    //         if (input.keyboard.keyHeld['ArrowLeft']) world.xOffset -= 0.05;
    //         if (input.keyboard.keyHeld['ArrowRight']) world.xOffset += 0.05;
    //     },
    // });

    library.runEngine();
};

const showStats = (
    charProps: {
        scaledW: number;
        scaledH: number;
        scaledX: number;
        scaledY: number;
        face: string;
        pos: {x: number; y: number};
    },
    world: WorldProperties,
    createElement: CreateElement<ShapeMap>,
    engine: Engine,
    canvas: HTMLCanvasElement,
    level: ReverseLevel,
) => {
    const posPointer = createElement('circle-pointer', {
        x: charProps.scaledX,
        y: charProps.scaledY - world.unitScale / 2,
        r: 5,
        fill: '#f00',
        text: 'Character Position',
        textAlign: 'center',
    });

    const face = createElement('text', {
        x: canvas.width / 2,
        y: 100,
        text: `face: ${charProps.face}`,
    });

    const worldOffsetX = createElement('text', {
        x: canvas.width / 2,
        y: 125,
        text: `xOffset: ${world.xOffset.toFixed(2)}`,
    });

    const checkYLeft = createElement('circle-pointer', {
        x: charProps.scaledX,
        y: charProps.scaledY + world.unitScale / 2,
        r: 5,
        fill: '#0f0',
        text: `create pointer checkYLeft`,
        textAlign: 'end',
    });

    const checkYRight = createElement('circle-pointer', {
        x: charProps.scaledX + world.unitScale,
        y: charProps.scaledY + world.unitScale / 2,
        r: 5,
        fill: '#00f',
        text: `create pointer checkYRight`,
    });

    engine.setUpdate({
        fn: () => {
            // posPointer.sketch.x = charProps.scaledX;
            // posPointer.sketch.y = charProps.scaledY;
            // posPointer.sketch.text = `x: ${charProps.pos.x.toFixed(2)}, y: ${charProps.pos.y.toFixed(2)}`;

            face.sketch.text = `face: ${charProps.face}`;
            worldOffsetX.sketch.text = `xOffset: ${world.xOffset.toFixed(2)}`;

            if (charProps.face === 'down') {
                checkYLeft.sketch.x = charProps.scaledX;
                checkYLeft.sketch.y = charProps.scaledY + world.unitScale;
                checkYLeft.sketch.text = `Y left: ${level.getTile(
                    Math.floor(charProps.pos.x),
                    Math.floor(charProps.pos.y + 0.95),
                )}`;
                checkYRight.sketch.x = charProps.scaledX + world.unitScale;
                checkYRight.sketch.y = charProps.scaledY + world.unitScale;
                checkYRight.sketch.text = `Y right: ${level.getTile(
                    Math.floor(charProps.pos.x + 0.95),
                    Math.floor(charProps.pos.y + 0.95),
                )}`;
            } else {
                checkYLeft.sketch.x = charProps.scaledX;
                checkYLeft.sketch.y = charProps.scaledY;
                checkYLeft.sketch.text = `Y left: ${level.getTile(
                    Math.floor(charProps.pos.x),
                    Math.floor(charProps.pos.y),
                )}`;
                checkYRight.sketch.x = charProps.scaledX + world.unitScale;
                checkYRight.sketch.y = charProps.scaledY;
                checkYRight.sketch.text = `Y right: ${level.getTile(
                    Math.floor(charProps.pos.x + 0.95),
                    Math.floor(charProps.pos.y),
                )}`;
            }
        },
    });

    // posPointer.show();
    face.show();
    worldOffsetX.show();
    checkYLeft.show();
    checkYRight.show();
};

//         tt.sketch.text = `scaledX: ${charProps.scaledX.toFixed(2)}, scaledY: ${charProps.scaledY.toFixed(2)}`;
//         ttE.sketch.text = `world Offset X: ${world.xOffset.toFixed(2)}`;
//         ttEE.sketch.text = `level char: ${
//             level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x - world.xOffset)]
//         }`;
//         tt2.sketch.text = `X: ${charProps.pos.x.toFixed(1)}, Y: ${charProps.pos.y.toFixed(1)}`;

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
// cc.show();
// tt.show();
// tt2.show();
// ttE.show();
// ttEE.show();
