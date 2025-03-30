import {Pos, Pos2} from 'library/types/shapes';
import {createPaintMethods} from './paint-index';

export const createViews = (context: CanvasRenderingContext2D) => {
    // const paintMethods = createPaintMethods(properties, methods, context);

    // Make optional, with user defined input keys/mousebuttons/touches
    // setTVEvents(properties, methods, input);

    // return {
    // ...properties,
    // ...paintMethods,
    // ...methods,
    // };
    return {tv: {}, sv: {}};
};

const pos = (x = 0, y = 0) => ({x, y});

const pos2 = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => ({x1, y1, x2, y2});

const properties = {
    offset: pos(),
    scale: pos(1, 1),
    // screen: pos(),
    // screen2: vector2(),
    world: pos(10, 10),
    screenSize: pos(300, 150),
    worldTL: pos(), // part of world borders
    worldBR: pos(10, 10), // part of world borders
    // startPan: pos(),
    // worldBeforeZoom: pos(),
    // worldAfterZoom: pos(),
    scaleFactor: 0.95,
    worldView: pos2(),
    orientation: '',
    // unitWeight: pos(1, 1),
    // history: Array(10).fill(pos()), // separate
};

type TransformedPos = {oX: number; oY: number};
type TransformedPos2 = {oX1: number; oY1: number; oX2: number; oY2: number};

const screen2World = (obj: Pos & TransformedPos) => {
    obj.oX = properties.world.x = obj.x / properties.scale.x + properties.offset.x;
    obj.oY = properties.world.y = obj.y / properties.scale.y + properties.offset.y;
};

const world2Screen = (obj: Pos & TransformedPos) => {
    obj.oX = (obj.x - properties.offset.x) * properties.scale.x;
    obj.oY = (obj.y - properties.offset.y) * properties.scale.y;
};

const world2Screen2 = (obj: Pos2 & TransformedPos2) => {
    obj.oX1 = (obj.x1 - properties.offset.x) * properties.scale.x;
    obj.oX1 = (obj.y1 - properties.offset.y) * properties.scale.y;
    obj.oX1 = (obj.x2 - properties.offset.x) * properties.scale.x;
    obj.oX1 = (obj.y2 - properties.offset.y) * properties.scale.y;
};

const setWorldView = (x: number, y: number, x2: number, y2: number) => {
    // properties.worldView.x = x / properties.scale.x + properties.offset.x;
    // properties.worldView.y = y / properties.scale.y + properties.offset.y;
    // properties.worldView.x2 = x2 / properties.scale.x + properties.offset.x;
    // properties.worldView.y2 = y2 / properties.scale.y + properties.offset.y;
};

const setScale = (scale: Vector) => {
    properties.scale.x = scale.x;
    properties.scale.y = scale.y;
};

const setOffset = (offset: Vector) => {
    properties.offset.x = offset.x;
    properties.offset.y = offset.y;
};

const setScreenSize = (size: Vector) => {
    properties.screenSize.x = size.x;
    properties.screenSize.y = size.y;
};

const setScaleFactor = (factor: number) => {
    properties.scaleFactor = factor;
};

const setDefaults = (canvas: HTMLCanvasElement) => {
    const {width, height} = canvas;

    let scaleXY: number;

    if (width > height) {
        scaleXY = height / 12;
        properties.orientation = 'landscape';
    } else {
        scaleXY = width / 12;
        properties.orientation = 'portrait';
    }

    setScale(vector(scaleXY, scaleXY));
    setScaleFactor(0.9);
    setScreenSize(vector(width, height));
};

const methods = {
    screen2World,
    world2Screen,
    world2Screen2,
    setWorldView,
    setScale,
    setScaleFactor,
    setScreenSize,
    setOffset,
    setDefaults,
};
