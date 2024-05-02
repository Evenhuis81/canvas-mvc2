import {gameStore} from '../tombraid/store';
import {mouse, setEvent} from '../tombraid/input';
import {setStatistic} from './statistics';
import {vector, vector2} from './canvas';
import type {StrokeRoundRectObj, Vector, Vector2} from 'types/game';

const offset = vector();
const scale = vector(1, 1);
const screen = vector2();
const world = vector();
const scaleFactor = 0.95;
// const scaleTo = vector();
const screenSize = vector();
const worldTL = vector();
const worldBR = vector();
const startPan = vector();
const worldBeforeZoom = vector();
const worldAfterZoom = vector();

const switches = {
    zooming: false,
};

const screen2World = (pos: Vector) => {
    world.x = pos.x / scale.x + offset.x;
    world.y = pos.y / scale.y + offset.y;
};

const world2ScreenRect = (pos: Vector, size: Vector) => {
    screen.x = (pos.x - offset.x) * scale.x;
    screen.y = (pos.y - offset.y) * scale.y;
    screen.x2 = (pos.x + size.x - offset.x) * scale.x;
    screen.y2 = (pos.y + size.y - offset.y) * scale.y;
};

const world2ScreenRectXY = (x: number, y: number, sX: number, sY: number) => {
    screen.x = (x - offset.x) * scale.x;
    screen.y = (y - offset.y) * scale.y;
    screen.x2 = (sX - offset.x) * scale.x;
    screen.y2 = (sY - offset.y) * scale.y;
};

const world2ScreenLine = (pos: Vector2) => {
    screen.x = (pos.x - offset.x) * scale.x;
    screen.y = (pos.y - offset.y) * scale.y;
    screen.x2 = (pos.x2 - offset.x) * scale.x;
    screen.y2 = (pos.y2 - offset.y) * scale.y;
};

const setOptional = (setOffset?: Vector, setScale?: Vector, worldBounds?: Vector2) => {
    if (setOffset) offset.set(setOffset);
    if (setScale) scale.set(setScale);
    if (worldBounds) {
        worldTL.setXY(worldBounds.x, worldBounds.y);
        worldBR.setXY(worldBounds.x2, worldBounds.y2);
    }
};

const getMiddleScreen = () => vector(screenSize.x / 2, screenSize.y / 2);

const update = () => {
    if (switches.zooming) {
        //
    }
};

export const getTv = (
    c: CanvasRenderingContext2D,
    screenSizeInc: Vector,
    worldBounds?: Vector2,
    setOffset?: Vector,
    setScale?: Vector,
) => {
    screenSize.set(screenSizeInc);
    setOptional(setOffset, setScale, worldBounds);

    const fillRect = (pos: Vector, size: Vector, color: string) => fillRectTV(c, pos, size, color);
    const strokeRect = (x: number, y: number, sX: number, sY: number, color: string) =>
        strokeRectTV(c, x, y, sX, sY, color);
    const line = (lineObj: Vector2) => lineTV(c, lineObj);
    const text = (txt: string, pos: Vector) => textTV(c, txt, pos);
    const strokeRoundRect = (obj: StrokeRoundRectObj) => strokeRoundRectTV(c, obj);

    setEvent('keydown', keydownListener);
    setEvent('mousedown', mousedownListener);
    setEvent('mousemove', mousemoveListener);
    setEvent('mouseup', mouseupListener);
    setEvent('wheel', wheelListener);

    setStatistic(() => `scaleX: ${scale.x.toFixed(2)}, scaleY: ${scale.y.toFixed(2)}`);
    setStatistic(() => `offsetX: ${offset.x.toFixed(2)}, offsetY: ${offset.y.toFixed(2)}`);

    return {update, fillRect, strokeRect, line, text, strokeRoundRect};
};

const strokeRoundRectTV = (c: CanvasRenderingContext2D, obj: StrokeRoundRectObj) => {
    world2ScreenRectXY(obj.x, obj.y, obj.sX, obj.sY);

    c.strokeStyle = 'white';

    c.beginPath();
    c.roundRect(screen.x, screen.y, screen.x2, screen.y2, obj.r);
    c.stroke();
};

const keyHeld: boolean[] = [];

const mousedownListener = (evt: MouseEvent) => {
    keyHeld[evt.button] = true;
    if (evt.button === 0) {
        startPan.setXY(evt.offsetX, evt.offsetY);

        screen2World(vector(evt.offsetX, evt.offsetY)); // = set to world vector
    }
};

const mousemoveListener = (evt: MouseEvent) => {
    if (keyHeld[0]) {
        offset.x -= (evt.offsetX - startPan.x) / scale.x;
        offset.y -= (evt.offsetY - startPan.y) / scale.y;

        startPan.setXY(evt.offsetX, evt.offsetY);
    }
};

const mouseupListener = ({button}: MouseEvent) => {
    delete keyHeld[button];
};

const keydownListener = ({code}: KeyboardEvent) => {
    if (code === 'KeyQ') zoom(getMiddleScreen(), 'out');
    else if (code === 'KeyE') zoom(getMiddleScreen(), 'in');
};

const wheelListener = (evt: WheelEvent) => {
    if (evt.deltaY < 0) {
        zoom(mouse, 'in');

        return;
    }

    zoom(mouse, 'out');
};

type Zoom = 'in' | 'out';

const zoomMechanic = {
    in: () => scale.div(scaleFactor),
    out: () => scale.mult(scaleFactor),
};

const zoom = (scalePos: Vector, type: Zoom) => {
    screen2World(scalePos);

    worldBeforeZoom.set(world);

    zoomMechanic[type]();

    screen2World(scalePos);

    worldAfterZoom.set(world);

    offset.x += worldBeforeZoom.x - worldAfterZoom.x;
    offset.y += worldBeforeZoom.y - worldAfterZoom.y;
};

const fillRectTV = (c: CanvasRenderingContext2D, pos: Vector, size: Vector, color: string) => {
    world2ScreenRect(pos, size);

    c.fillStyle = color;

    c.fillRect(screen.x, screen.y, screen.x2 - screen.x, screen.y2 - screen.y);
};

const strokeRectTV = (c: CanvasRenderingContext2D, x: number, y: number, sX: number, sY: number, color: string) => {
    world2ScreenRectXY(x, y, sX, sY);

    c.strokeStyle = color;

    c.strokeRect(screen.x, screen.y, screen.x2 - screen.x, screen.y2 - screen.y);
};

const lineTV = (c: CanvasRenderingContext2D, line: Vector2) => {
    world2ScreenLine(line);

    c.lineWidth = scale.x * 0.1;
    c.strokeStyle = '#00f';

    c.beginPath();
    c.moveTo(screen.x, screen.y);
    c.lineTo(screen.x2, screen.y2);
    c.stroke();
};

const textTV = (c: CanvasRenderingContext2D, txt: string, pos: Vector) => {
    c.font = '16px serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#fff';

    const metrics = c.measureText(txt);
    const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

    c.fillText(txt, pos.x + metrics.width / 2, pos.y + fontHeight / 2);
};

const gridPos = vector2();

export const grid = (size: number) => {
    const show = () => {
        for (let y = 0; y < size + 1; y++) {
            for (let x = 0; x < size + 1; x++) {
                // columns (vertical)
                gridPos.setManual(x, 0, x, size);
                gameStore.state.tv.line(gridPos);

                // rows (horizontal)
                gridPos.setManual(0, y, size, y);
                gameStore.state.tv.line(gridPos);
            }
        }
    };

    return {show};
};
