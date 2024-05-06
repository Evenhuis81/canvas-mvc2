import {FillRect, Line, StrokeRect, StrokeRoundRect, TVOptions, Text, Zoom} from './types/tv';
import {mouse, setEvent} from '../tombraid/input';
import {setStatistic} from './statistics';
import {vector, vector2} from './canvas';
import type {Vector, Vector2} from 'types/game';

let ctx: CanvasRenderingContext2D;

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
    // gridSize: 0,
};

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

//     vector(canvas.width, canvas.height), // Screen size
//     vector2(0, 0, canvas.width, canvas.height), // World size
//     vector(), // Offset
//     vector(canvas.width / 13, canvas.height / 13), // Scale
//     true, // show world borders (showWorldBorders function on return object)
//     0, // show grid + size (undefined or 0 is used as falsy);
// }

const worldClamp = vector2();

const setWorldClamp = (x: number, y: number, x2: number, y2: number) => {
    worldClamp.x = x / tv.scale.x + tv.offset.x;
    worldClamp.y = y / tv.scale.y + tv.offset.y;
    worldClamp.x2 = x2 / tv.scale.x + tv.offset.x;
    worldClamp.y2 = y2 / tv.scale.y + tv.offset.y;
};

export const getTV = (options: TVOptions) => {
    ctx = options.context;
    tv.screenSize.set(options.screenSize);
    setOptional(options.offset, options.scale, options.worldBorders);

    setEvents();

    const update = () => {
        setWorldClamp(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    setStatistic(() => `offsetX: ${tv.offset.x.toFixed(2)}, Y: ${tv.offset.y.toFixed(2)}`);
    setStatistic(() => `scale: ${tv.scale.x.toFixed(2)}`);

    return {worldClamp, update, fillRect, strokeRect, strokeRoundRect, line, text};
};

const setEvents = () => {
    setEvent('keydown', keydownListener);
    setEvent('mousedown', mousedownListener);
    setEvent('mousemove', mousemoveListener);
    setEvent('mouseup', mouseupListener);
    setEvent('wheel', wheelListener);
};

const fillRect: FillRect = obj => {
    world2Screen(obj.x, obj.y);

    ctx.fillStyle = obj.color;

    ctx.fillRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const strokeRect: StrokeRect = obj => {
    world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.color;

    ctx.strokeRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const line: Line = obj => {
    world2Screen2(obj.x, obj.y, obj.x2, obj.y2);

    ctx.lineWidth = tv.scale.x * 0.1;
    ctx.strokeStyle = '#00f';

    ctx.beginPath();
    ctx.moveTo(tv.screen.x, tv.screen.y);
    ctx.lineTo(tv.screen.x2, tv.screen.y2);
    ctx.stroke();
};

const text: Text = obj => {
    world2Screen(obj.x, obj.y);

    ctx.font = `${tv.scale.x}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';

    ctx.fillText(obj.txt, tv.screen.x, tv.screen.y);
};

const strokeRoundRect: StrokeRoundRect = obj => {
    world2Screen(obj.x, obj.y);

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y, obj.r * tv.scale.x);
    ctx.stroke();
};

const keyHeld: boolean[] = [];

const mousedownListener = (evt: MouseEvent) => {
    keyHeld[evt.button] = true;
    if (evt.button === 0) {
        tv.startPan.setXY(evt.offsetX, evt.offsetY);

        screen2World(evt.offsetX, evt.offsetY); // = set to world vector
    }
};

const mousemoveListener = (evt: MouseEvent) => {
    if (keyHeld[0]) {
        tv.offset.x -= (evt.offsetX - tv.startPan.x) / tv.scale.x;
        tv.offset.y -= (evt.offsetY - tv.startPan.y) / tv.scale.y;

        tv.startPan.setXY(evt.offsetX, evt.offsetY);
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

// const gridPos = vector2();

// const gridShow = () => {
//     for (let y = 0; y < gridSize + 1; y++) {
//         for (let x = 0; x < gridSize + 1; x++) {
//             // columns (vertical)
//             gridPos.setManual(x, 0, x, gridSize);
//             gameStore.state.tv.line(gridPos);

//             // rows (horizontal)
//             gridPos.setManual(0, y, gridSize, y);
//             gameStore.state.tv.line(gridPos);
//         }
//     }
// };
