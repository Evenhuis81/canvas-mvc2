import {initialize} from 'library/index';
import {createCharacter} from './character';
import {createLevelDraw, getLevel, getLevelRaster} from './level';
import type {ReverseLevel} from './level';
import type {LibraryOptions} from 'library/types';
import type {ShapeMap} from 'library/entity/defaults/shapes';
import type {Engine} from 'library/types/engine';
import type {CreateElement, EntityElement} from 'library/entity';
import {getTV} from 'library/views/tv';

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
    const {canvas, context, engine, createElement, input} = library;

    setScreen(canvas);

    const tv = getTV(context, input);

    tv.setScale({x: world.unitScale, y: world.unitScale});
    tv.setScaleFactor(0.99);
    tv.setScreenSize({x: canvas.width, y: canvas.height});
    // tv.setUnitWeight({x: 1 / world.xUnits, y: 1 / world.xUnits});
    //     tv.setWorldBorders(vector2(0, 0, level.width, level.height));
    //     tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
    //     const player = getPlayer(level.playerStart);
    //     playerStore.set(player);
    //     // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
    //     engine.setUpdate(player.update);
    //     // when a component use the gamestore, make create functions so they can be used at a later point
    //     const levelShow = level.createShow(level.map, level.coins, tv);
    //     engine.setDraw(levelShow);
    //     engine.setDraw(player.show);

    //     engine.showsOverview();
    //     engine.updatesOverview();

    console.log(tv);

    const level = getLevel(1);

    const levelDraw = createLevelDraw(context, world, level);

    const {
        draw: charDraw,
        update: charUpdate,
        properties: charProps,
        pos: charPos,
        vel: charVel,
    } = createCharacter(world, context, canvas, level, createElement);

    const handlers = {
        ArrowUp: () => (charPos.y -= charProps.speed),
        ArrowDown: () => (charPos.y += charProps.speed),
        ArrowLeft: () => (charPos.x -= charProps.speed),
        ArrowRight: () => (charPos.x += charProps.speed),
    };

    input.addMovement('reverse', handlers);
    // input.removeMovement('reverse');

    engine.setUpdate(charUpdate);

    engine.setDraw(levelDraw);
    engine.setDraw(charDraw);

    const statElements = characterStatisticsElements(charProps, world, createElement, canvas);

    const levelRaster = getLevelRaster(context, tv, level.width, level.height, {
        scale: world.unitScale,
        strokeStyle: 'white',
        lineWidth: 1 / world.xUnits,
    });

    engine.setDraw(levelRaster);

    library.runEngine();
};

const characterStatisticsElements = (
    props: {
        scaledW: number;
        scaledH: number;
        scaledX: number;
        scaledY: number;
        face: string;
    },
    world: WorldProperties,
    createElement: CreateElement<ShapeMap>,
    canvas: HTMLCanvasElement,
) => {
    const posPointer = createElement('circle-pointer', {
        x: props.scaledX,
        y: props.scaledY - world.unitScale / 2,
        r: 5,
        fill: '#f00',
        text: 'Character Position',
        textAlign: 'center',
    });

    const face = createElement('text', {
        x: canvas.width / 2,
        y: 100,
        text: `face: ${props.face}`,
    });

    const worldOffsetX = createElement('text', {
        x: canvas.width / 2,
        y: 125,
        text: `xOffset: ${world.xOffset.toFixed(2)}`,
    });

    // = just position (scaled)
    const collisionTopLeft = createElement('circle-pointer', {
        x: props.scaledX,
        y: props.scaledY,
        r: 5,
        fill: '#0f0',
        text: `pointer collisionTopLeft`,
        textAlign: 'end',
    });

    const collisionBottomLeft = createElement('circle-pointer', {
        x: props.scaledX,
        y: props.scaledY + world.unitScale,
        r: 5,
        fill: '#0f0',
        text: `pointer collisionBottomLeft`,
        textAlign: 'end',
    });

    const collisionTopRight = createElement('circle-pointer', {
        x: props.scaledX + world.unitScale,
        y: props.scaledY,
        r: 5,
        fill: '#00f',
        text: `pointer collisionTopRight`,
        textAlign: 'start',
    });

    const collisionBottomRight = createElement('circle-pointer', {
        x: props.scaledX + world.unitScale,
        y: props.scaledY + world.unitScale,
        r: 5,
        fill: '#00f',
        text: `pointer collisionBottomRight`,
        textAlign: 'start',
    });

    return {
        topLeft: collisionTopLeft,
        bottomLeft: collisionBottomLeft,
        topRight: collisionTopRight,
        bottomRight: collisionBottomRight,
    };
};

//         tt.sketch.text = `scaledX: ${charProps.scaledX.toFixed(2)}, scaledY: ${charProps.scaledY.toFixed(2)}`;
//         ttE.sketch.text = `world Offset X: ${world.xOffset.toFixed(2)}`;
//         ttEE.sketch.text = `level char: ${
//             level1[Math.floor(charprops.pos.y)][Math.floor(charprops.pos.x - world.xOffset)]
//         }`;
//         tt2.sketch.text = `X: ${charprops.pos.x.toFixed(1)}, Y: ${charprops.pos.y.toFixed(1)}`;

// const tt = createElement('text', {
//     text: `scaledX: ${charProps.scaledX}, scaledY: ${charProps.scaledY}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const tt2 = createElement('text', {
//     text: `X: ${charprops.pos.x}, Y: ${charprops.pos.y}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2 + 15,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const tt3 = createElement('text', {
//     text: `levelCharacter: ${level1[Math.floor(charprops.pos.y)][Math.floor(charprops.pos.x)]}`,
//     x: charProps.scaledX + charProps.scaledW / 2,
//     y: charProps.scaledY + charProps.scaledH / 2 - 15,
//     textAlign: 'end',
//     textBaseLine: 'top',
// });
// const ttE = createElement('text', {text: `world offset X: ${world.xOffset.toFixed(2)}`, textAlign: 'start'});
// const ttEE = createElement('text', {
//     text: `level char: ${level1[Math.floor(charprops.pos.y)][Math.floor(charprops.pos.x - world.xOffset)]}`,
//     textAlign: 'start',
//     y: 25,
// });
// cc.show();
// tt.show();
// tt2.show();
// ttE.show();
// ttEE.show();
