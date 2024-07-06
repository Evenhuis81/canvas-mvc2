/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable prefer-destructuring */
import {getPaintMethods} from './paint';
import {setTVEvents} from './input';
import {vec, vector, vector2} from '../vector';
import type {Vector, Vector2} from 'library/types/vector';
import type {Zoom} from 'library/types/tv';
import {statistics} from 'games/tombraid';

// Use only vectors if possible
export const getTV = (context: CanvasRenderingContext2D) => {
    const paintMethods = getPaintMethods(properties, methods, context);

    // Create an option out of this
    setTVEvents(properties, methods);

    return {
        ...properties,
        ...paintMethods,
        ...methods,
    };
};

const velocity = vector();

const properties = {
    offset: vector(),
    scale: vector(1, 1),
    screen: vector(),
    screen2: vector2(),
    world: vector(10, 10),
    screenSize: vector(300, 150),
    worldTL: vector(),
    worldBR: vector(10, 10),
    startPan: vector(),
    worldBeforeZoom: vector(),
    worldAfterZoom: vector(),
    scaleFactor: 0.95,
    worldView: vector2(),
    orientation: '',
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
    properties.screen2.x = (x - properties.offset.x) * properties.scale.x;
    properties.screen2.y = (y - properties.offset.y) * properties.scale.y;
    properties.screen2.x2 = (x2 - properties.offset.x) * properties.scale.x;
    properties.screen2.y2 = (y2 - properties.offset.y) * properties.scale.y;
};

const getMiddleScreen = () => vector(properties.screenSize.x / 2, properties.screenSize.y / 2);

const setWorldView = (x: number, y: number, x2: number, y2: number) => {
    properties.worldView.x = x / properties.scale.x + properties.offset.x;
    properties.worldView.y = y / properties.scale.y + properties.offset.y;
    properties.worldView.x2 = x2 / properties.scale.x + properties.offset.x;
    properties.worldView.y2 = y2 / properties.scale.y + properties.offset.y;
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

const setMiddle = (source: Vector) => {
    const {x, y} = getMiddleScreen();
    screen2World(x, y);
    setOffset(vector(-properties.world.x + source.x, -properties.world.y + source.y));
};

const moveTo = (target: Vector, slowR = 2) => {
    const frictionChange = 0.1;
    let count = 0;
    const strength = vector();

    statistics.state.set({
        id: 0, // test
        name: 'test stat',
        fn: () => `strength.x: ${strength.x.toFixed(2)} & strength.y: ${strength.y.toFixed(2)}`,
    });

    return {
        id: 11,
        name: 'tv move to target',
        fn: () => {
            if (++count < 20) return;

            const strengthFactor = 2000;

            const worldMiddle = s2W(getMiddleScreen());

            strength.x = worldMiddle.x - target.x;
            strength.y = worldMiddle.y - target.y;

            const acc = vector(strength.x / strengthFactor, strength.y / strengthFactor);

            vec.add(velocity, acc);

            vec.limit(velocity, -0.75, 0.75);

            const length = vec.mag(strength);

            if (length < slowR) {
                let friction = vec.mag(strength) / slowR;

                friction = 1 - friction;

                friction *= frictionChange;

                friction = 1 - friction;

                if (length < 0.1) vec.multScalar(velocity, 0);
                else vec.multScalar(velocity, friction);
            }

            vec.sub(properties.offset, velocity);

            count++;
        },
    };
};

const s2W = (source: Vector) =>
    vector(source.x / properties.scale.x + properties.offset.x, source.y / properties.scale.y + properties.offset.y);

const methods = {
    screen2World,
    world2Screen,
    world2Screen2,
    zoomMechanic,
    zoom,
    getMiddleScreen,
    setWorldView,
    setScale,
    setScaleFactor,
    setScreenSize,
    setWorldBorders,
    setOffset,
    setDefaults,
    setMiddle,
    moveTo,
};
