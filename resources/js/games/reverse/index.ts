import {initialize} from 'library/index';
import {createCharacter} from './character';
import {getLevel} from './level';
import type {LibraryOptions} from 'library/types';
import {createTileDraw} from 'library/views/raster';

const libraryID = 'reverse';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
    dotMiddle: true,
    images: [
        {
            id: 'tri',
            filename: 'isoceles_triangle_transparant.png',
            container: new Image(), // this should be optional
        },
    ],
};

export default async () => {
    const library = await initialize(libraryID, libraryOptions);
    const {
        canvas,
        context,
        engine,
        createElement,
        input,
        views: {tv},
        images,
    } = library;

    const level = getLevel(1);

    const scale = canvas.width / 12;

    tv.setScale({x: scale, y: scale});
    tv.setVisibleTiles(level.visibleTilesX, level.visibleTilesY);

    const testRaster: Array<Array<'X' | 'O'>> = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
    ];

    type Oh = {
        // type: 'O';
        stroke: string;
    };

    type Ix = {
        // type: 'X';
        fill: string;
    };

    type TileMapRaw = {
        X: Ix;
        O: Oh;
    };

    type TileMap<O extends object> = {[K in keyof O]: O[K] & {type: K}};

    type Tiles = Oh | Ix;

    const testTiles: TileMap<TileMapRaw> = {
        X: {
            type: 'X',
            fill: '#0f0',
        },
        O: {
            type: 'O',
            stroke: '#f00',
        },
    };

    const tileDraw = createTileDraw(context, tv, testRaster);

    // const levelDraw = createLevelDraw(context, tv, level);

    const {
        draw: charDraw,
        update: charUpdate,
        properties: charProps,
        pos: charPos,
        // vel: charVel,
    } = createCharacter(tv, input);

    const movement = {
        KeyA: () => {
            // vehicle turn left
        },
        KeyD: () => {
            // vehicle turn right
        },
        Space: () => {
            // Thrust
        },
    };

    // input.addMovement('reverse', movement);
    // input.removeMovement('reverse');

    // engine.setUpdate(charUpdate);
    engine.setDraw(tileDraw);
    // engine.setDraw(charDraw);

    library.runEngine();

    // const vehicle = createVehicle(tv, context, world.unitScale);

    // const statElements = characterStatisticsElements(charProps, world, createElement, canvas);
    // statElements.bottomLeft.show();

    // const levelRaster = createRaster(context, tv);

    // engine.setDraw(levelRaster);

    // KeyW: () => (charPos.y -= charProps.speed),
    // KeyS: () => (charPos.y += charProps.speed),
    // KeyA: () => (charPos.x -= charProps.speed),
    // KeyD: () => (charPos.x += charProps.speed),
    // ArrowUp: () => (triangle.y -= charProps.speed),
    // ArrowDown: () => (triangle.y += charProps.speed),
    // ArrowLeft: () => (triangle.x -= charProps.speed),
    // ArrowRight: () => (triangle.x += charProps.speed),

    // engine.setBaseUpdate(() => (triangle.angle += 0.01));
    // engine.setBaseDraw(() => tv.paint.imageTileRotation(triangle));

    // engine.setBaseUpdate(vehicle.update);
    // engine.setBaseDraw(vehicle.draw);
};

// export type WorldProperties = {
//     xUnits: number;
//     yUnits: number;
//     xOffset: number;
//     yOffset: number;
//     xSpeed: number;
//     ySpeed: number;
//     xMargin: number;
//     yMargin: number;
//     unitScale: number; // unitLength & unitHeight is the same
//     display: 'portrait' | 'landscape';
// };

// const world: WorldProperties = {
//     xUnits: 16,
//     yUnits: 9,
//     xOffset: 0,
//     yOffset: 0,
//     xSpeed: 0.002,
//     ySpeed: 0,
//     xMargin: 0,
//     yMargin: 0,
//     unitScale: 0,
//     display: 'portrait',
// };

// const setScreen = (canvas: HTMLCanvasElement) => {
//     world.unitScale = canvas.width / world.xUnits;

//     if (canvas.width > canvas.height) {
//         world.display = 'portrait';

//         world.yMargin = (canvas.height - world.unitScale * world.yUnits) / 2;

//         return;
//     }

//     world.display = 'landscape';

//     world.xMargin = (canvas.width - world.unitScale * 16) / 2;
// };

// const characterStatisticsElements = (
//     props: {
//         scaledW: number;
//         scaledH: number;
//         scaledX: number;
//         scaledY: number;
//         face: string;
//     },
//     world: WorldProperties,
//     createElement: CreateElement<ShapeMap>,
//     canvas: HTMLCanvasElement,
// ) => {
//     const posPointer = createElement('circle-pointer', {
//         x: props.scaledX,
//         y: props.scaledY - world.unitScale / 2,
//         r: 5,
//         fill: '#f00',
//         text: 'Character Position',
//         textAlign: 'center',
//     });

//     const face = createElement('text', {
//         x: canvas.width / 2,
//         y: 100,
//         text: `face: ${props.face}`,
//     });

//     const worldOffsetX = createElement('text', {
//         x: canvas.width / 2,
//         y: 125,
//         text: `xOffset: ${world.xOffset.toFixed(2)}`,
//     });

//     // = just position (scaled)
//     const collisionTopLeft = createElement('circle-pointer', {
//         x: props.scaledX,
//         y: props.scaledY,
//         r: 5,
//         fill: '#0f0',
//         text: `pointer collisionTopLeft`,
//         textAlign: 'end',
//     });

//     const collisionBottomLeft = createElement('circle-pointer', {
//         x: props.scaledX,
//         y: props.scaledY + world.unitScale,
//         r: 5,
//         fill: '#0f0',
//         text: `pointer collisionBottomLeft`,
//         textAlign: 'end',
//     });

//     const collisionTopRight = createElement('circle-pointer', {
//         x: props.scaledX + world.unitScale,
//         y: props.scaledY,
//         r: 5,
//         fill: '#00f',
//         text: `pointer collisionTopRight`,
//         textAlign: 'start',
//     });

//     const collisionBottomRight = createElement('circle-pointer', {
//         x: props.scaledX + world.unitScale,
//         y: props.scaledY + world.unitScale,
//         r: 5,
//         fill: '#00f',
//         text: `pointer collisionBottomRight`,
//         textAlign: 'start',
//     });

//     return {
//         topLeft: collisionTopLeft,
//         bottomLeft: collisionBottomLeft,
//         topRight: collisionTopRight,
//         bottomRight: collisionBottomRight,
//     };
// };

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
