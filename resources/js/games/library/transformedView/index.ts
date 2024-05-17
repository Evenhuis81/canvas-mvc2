import {FillRect, Line, RoundFillStrokeRect, StrokeRect, TVOptions, Text, Zoom} from '../types/tv';
import {setStatistic} from '../statistics';
import {setTVEvents} from './input';
import {vector, vector2} from '../canvas';
import type {Vector, Vector2} from 'games/tombraid/types/game';

let ctx: CanvasRenderingContext2D;

// methods
const screen2World = (x: number, y: number) => {
    tv.world.x = x / tv.scale.x + tv.offset.x;
    tv.world.y = y / tv.scale.y + tv.offset.y;
};

const world2Screen = (x: number, y: number) => {
    tv.screen.x = (x - tv.offset.x) * tv.scale.x;
    tv.screen.y = (y - tv.offset.y) * tv.scale.y;
};

const world2Screen2 = (x: number, y: number, x2: number, y2: number) => {
    tv.screen.x = (x - tv.offset.x) * tv.scale.x;
    tv.screen.y = (y - tv.offset.y) * tv.scale.y;
    tv.screen.x2 = (x2 - tv.offset.x) * tv.scale.x;
    tv.screen.y2 = (y2 - tv.offset.y) * tv.scale.y;
};

const setOptional = (offset?: Vector, scale?: Vector, worldBounds?: Vector2) => {
    if (offset) tv.offset.set(offset);

    if (scale) tv.scale.set(scale);

    if (worldBounds) {
        tv.worldTL.setXY(worldBounds.x, worldBounds.y);
        tv.worldBR.setXY(worldBounds.x2, worldBounds.y2);
    }
};

const getMiddleScreen = () => vector(tv.screenSize.x / 2, tv.screenSize.y / 2);

const setWorldClamp = (x: number, y: number, x2: number, y2: number) => {
    tv.worldClamp.x = x / tv.scale.x + tv.offset.x;
    tv.worldClamp.y = y / tv.scale.y + tv.offset.y;
    tv.worldClamp.x2 = x2 / tv.scale.x + tv.offset.x;
    tv.worldClamp.y2 = y2 / tv.scale.y + tv.offset.y;
};

const zoomMechanic = {
    in: () => tv.scale.div(tv.scaleFactor),
    out: () => tv.scale.mult(tv.scaleFactor),
};

const zoom = (scalePos: Vector, type: Zoom) => {
    screen2World(scalePos.x, scalePos.y);

    tv.worldBeforeZoom.set(tv.world);

    zoomMechanic[type]();

    screen2World(scalePos.x, scalePos.y);

    tv.worldAfterZoom.set(tv.world);

    tv.offset.x += tv.worldBeforeZoom.x - tv.worldAfterZoom.x;
    tv.offset.y += tv.worldBeforeZoom.y - tv.worldAfterZoom.y;
};

const methods = {
    screen2World,
    world2Screen,
    world2Screen2,
    getMiddleScreen,
    setWorldClamp,
    zoomMechanic,
    zoom,
};

export const getTV = (options: TVOptions) => {
    ctx = options.context;

    tv.screenSize.set(options.screenSize);

    setOptional(options.offset, options.scale, options.worldBorders);

    setTVEvents(tv);

    const update = () => {
        setWorldClamp(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    setStatistic(() => `offsetX: ${tv.offset.x.toFixed(2)}, Y: ${tv.offset.y.toFixed(2)}`);
    setStatistic(() => `scale: ${tv.scale.x.toFixed(2)}`);

    return {
        worldClamp: tv.worldClamp,
        update,
        fillRect,
        strokeRect,
        roundFillStrokeRect,
        line,
        text,
        offset: tv.offset,
    };
};

const fillRect: (obj: FillRect) => void = obj => {
    world2Screen(obj.x, obj.y);

    ctx.fillStyle = obj.fill;

    ctx.fillRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const strokeRect: (obj: StrokeRect) => void = obj => {
    world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.stroke;

    ctx.strokeRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const line: (obj: Line) => void = obj => {
    world2Screen2(obj.x, obj.y, obj.x2, obj.y2);

    ctx.lineWidth = tv.scale.x * 0.1; // make non-hardcorded
    ctx.strokeStyle = obj.stroke;

    ctx.beginPath();
    ctx.moveTo(tv.screen.x, tv.screen.y);
    ctx.lineTo(tv.screen.x2, tv.screen.y2);
    ctx.stroke();
};

const text: (obj: Text) => void = obj => {
    world2Screen(obj.x, obj.y);

    ctx.font = `${tv.scale.x}px serif`; // make non-hardcoded
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = obj.fill;

    ctx.fillText(obj.txt, tv.screen.x, tv.screen.y);
};

const roundFillStrokeRect: (obj: RoundFillStrokeRect) => void = obj => {
    world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.stroke;
    ctx.fillStyle = obj.fill;

    ctx.beginPath();
    ctx.roundRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y, obj.r * tv.scale.x);
    ctx.fill();
    ctx.stroke();
};

const tv = {
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
    ...methods,
};
