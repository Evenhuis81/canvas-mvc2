/* eslint-disable max-lines-per-function */
/* eslint-disable prefer-destructuring */
import {getPaintMethods} from './paint';
import {setTVEvents} from './input';
import {vector, vector2} from '../vector';
import type {Vector, Vector2} from '../types';
import type {Zoom} from '../types/tv';

export const getTV = (context: CanvasRenderingContext2D) => {
    const paintMethods = getPaintMethods(properties, methods, context);

    setTVEvents(properties, methods);

    return {
        ...properties,
        ...paintMethods,
        ...methods,
    };
};

const properties = {
    offset: vector(),
    scale: vector(1, 1),
    screen: vector2(),
    world: vector(10, 10),
    screenSize: vector(300, 150),
    worldTL: vector(),
    worldBR: vector(10, 10),
    startPan: vector(),
    worldBeforeZoom: vector(),
    worldAfterZoom: vector(),
    scaleFactor: 0.95,
    worldClamp: vector2(),
};

const screen2World = (x: number, y: number) => {
    properties.world.x = x / properties.scale.x + properties.offset.x;
    properties.world.y = y / properties.scale.y + properties.offset.y;
};

const world2Screen = (x: number, y: number) => {
    properties.screen.x = (x - properties.offset.x) * properties.scale.x;
    properties.screen.y = (y - properties.offset.y) * properties.scale.y;
};

const world2Screen2 = (x: number, y: number, x2: number, y2: number) => {
    properties.screen.x = (x - properties.offset.x) * properties.scale.x;
    properties.screen.y = (y - properties.offset.y) * properties.scale.y;
    properties.screen.x2 = (x2 - properties.offset.x) * properties.scale.x;
    properties.screen.y2 = (y2 - properties.offset.y) * properties.scale.y;
};

const getMiddleScreen = () => vector(properties.screenSize.x / 2, properties.screenSize.y / 2);

const setWorldClamp = (x: number, y: number, x2: number, y2: number) => {
    properties.worldClamp.x = x / properties.scale.x + properties.offset.x;
    properties.worldClamp.y = y / properties.scale.y + properties.offset.y;
    properties.worldClamp.x2 = x2 / properties.scale.x + properties.offset.x;
    properties.worldClamp.y2 = y2 / properties.scale.y + properties.offset.y;
};

const zoomMechanic = {
    in: () => {
        properties.scale.x /= properties.scaleFactor;
        properties.scale.y /= properties.scaleFactor;
    },
    out: () => {
        properties.scale.x *= properties.scaleFactor;
        properties.scale.y *= properties.scaleFactor;
    },
};

const zoom = (scalePos: Vector, type: Zoom) => {
    screen2World(scalePos.x, scalePos.y);

    properties.worldBeforeZoom.x = properties.world.x;
    properties.worldBeforeZoom.y = properties.world.y;

    zoomMechanic[type]();

    screen2World(scalePos.x, scalePos.y);

    properties.worldAfterZoom.x = properties.world.x;
    properties.worldAfterZoom.y = properties.world.y;

    properties.offset.x += properties.worldBeforeZoom.x - properties.worldAfterZoom.x;
    properties.offset.y += properties.worldBeforeZoom.y - properties.worldAfterZoom.y;
};

const createTVUpdateSetWorldClamp = ({width, height}: HTMLCanvasElement) => ({
    id: 1,
    name: 'update world clamp',
    fn: () => setWorldClamp(0, 0, width, height),
});

const setScale = (scale: Vector) => {
    properties.scale.x = scale.x;
    properties.scale.y = scale.y;
};

const setOffset = (offset: Vector) => {
    properties.offset.x = offset.x;
    properties.offset.y = offset.y;
};

const setWorldBorders = (borders: Vector2) => {
    properties.worldTL.x = borders.x;
    properties.worldTL.y = borders.y;
    properties.worldBR.x = borders.x2;
    properties.worldBR.y = borders.y2;
};

const setScreenSize = (size: Vector) => {
    properties.screenSize.x = size.x;
    properties.screenSize.y = size.y;
};

const setScaleFactor = (factor: number) => {
    properties.scaleFactor = factor;
};

const setDefaults = (context: CanvasRenderingContext2D) => {
    const {width, height} = context.canvas;

    let scale: number;
    // let orientation: 'landscape' | 'portrait';
    const worldBorders = vector2();

    if (width > height) {
        // h = 12 (worldBorders.y = 18 (-3, +3))
        // w = 24 (16:9 not exactly?, worldBorders.x = 36 (-6, +6)
        scale = height / 12;
        // orientation = 'landscape';
        worldBorders.x = -6;
        worldBorders.y = -3;
        worldBorders.x2 = 30;
        worldBorders.y2 = 15;
    } else {
        // h = 24 (9:16 not exactly?, worldBorders.y = 36 (-6, +6))
        // w = 12 (worldBorders.x = 18 (-3, +3)
        scale = width / 12;
        // orientation = 'portrait';
        worldBorders.x = -3;
        worldBorders.y = -6;
        worldBorders.x2 = 15;
        worldBorders.y2 = 30;
    }

    setScale(vector(scale, scale));
    setScaleFactor(0.9);
    setScreenSize(vector(width, height));
    setWorldBorders(worldBorders);

    // offset 0,0 with these borders?
    // tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
};

const getGrid = (ctx: CanvasRenderingContext2D) => {
    const {worldTL, worldBR, offset, scale, screen} = properties;

    const show = {
        id: 89,
        name: 'tv grid',
        fn: () => {
            let xLinesDrawn = 0;
            let yLinesDrawn = 0;

            ctx.strokeStyle = '#bbbb';
            ctx.lineWidth = 1;
            ctx.beginPath();

            for (let x = worldTL.x; x <= worldBR.x; x++) {
                // Columns
                world2Screen(x, worldTL.y);

                ctx.moveTo(screen.x, screen.y);
                ctx.lineTo(screen.x, (worldBR.y - offset.y) * scale.y);

                yLinesDrawn++;
            }

            for (let y = worldTL.y; y <= worldBR.y; y++) {
                // Rows
                world2Screen(worldTL.x, y);

                ctx.moveTo(screen.x, screen.y);
                ctx.lineTo((worldBR.x - offset.x) * scale.x, screen.y);

                xLinesDrawn++;
            }

            ctx.stroke();

            ctx.font = '24px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';

            ctx.fillText(`yLines: ${yLinesDrawn.toString()}`, 80, 30);
            ctx.fillText(`xLines: :${xLinesDrawn.toString()}`, 80, 60);
        },
    };

    // properties.screen.x = (x - properties.offset.x) * properties.scale.x;
    // properties.screen.y = (y - properties.offset.y) * properties.scale.y;

    // const update = {
    //     id: 89,
    //     name: 'tv grid',
    //     fn: () => {
    //         //
    //     },
    // }
    return {show};
};

const methods = {
    screen2World,
    world2Screen,
    world2Screen2,
    zoomMechanic,
    zoom,
    getMiddleScreen,
    setWorldClamp,
    createTVUpdateSetWorldClamp,
    setScale,
    setScaleFactor,
    setScreenSize,
    setWorldBorders,
    setOffset,
    setDefaults,
    getGrid,
};
