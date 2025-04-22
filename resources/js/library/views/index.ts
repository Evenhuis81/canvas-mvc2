import {TVMethods, TVProperties, TransformedView} from 'library/types/views';
import {createPaint} from './paint-index';
import {LibraryInput} from 'library/types/input';
import {createInputTV} from './input-tv';
import {Engine} from 'library/types/engine';

export const createViews = (
    context: CanvasRenderingContext2D,
    input: LibraryInput,
    engine: Engine,
): {tv: TransformedView} => {
    const tvProperties = createProperties();

    const methods = createMethods(tvProperties, context);
    const paint = createPaint(tvProperties, methods, context);

    const inputTV = createInputTV(tvProperties, methods, input, engine, context.canvas.width, context.canvas.height);

    return {tv: Object.assign(tvProperties, methods, {paint}, inputTV)};
};

const createMethods = (props: TVProperties, context: CanvasRenderingContext2D): TVMethods => ({
    screen2World: (x, y) => ({
        xT: x / props.scale.x + props.offset.x,
        yT: y / props.scale.y + props.offset.y,
    }),
    world2Screen: (xT, yT) => ({
        x: (xT - props.offset.x) * props.scale.x,
        y: (yT - props.offset.y) * props.scale.y,
    }),
    world2Screen2: (xT1, yT1, xT2, yT2) => ({
        x1: (xT1 - props.offset.x) * props.scale.x,
        y1: (yT1 - props.offset.y) * props.scale.y,
        x2: (xT2 - props.offset.x) * props.scale.x,
        y2: (yT2 - props.offset.y) * props.scale.y,
    }),
    setScale: scale => (props.scale = scale),
    setOffset: offset => (props.offset = offset),
    screenMiddle: () => vector(context.canvas.width / 2, context.canvas.height / 2),
    setUnitProperties: (unitsX, unitsY, unitsVisibleX, unitsVisibleY) => {
        props.units.x = unitsX;
        props.units.y = unitsY;
        props.unitsVisible.x = unitsVisibleX;
        props.unitsVisible.y = unitsVisibleY;
    },
});

const vector = (x = 0, y = 0) => ({x, y});
// const pos2 = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => ({x1, y1, x2, y2});
const worldVector = (xT = 0, yT = 0) => ({xT, yT});

const createProperties = (): TVProperties => ({
    offset: vector(),
    scale: vector(1, 1),
    startPan: vector(),
    worldBeforeZoom: worldVector(),
    worldAfterZoom: worldVector(),
    scaleMouse: 0.95,
    scaleKeyboard: 0.99,
    units: vector(10, 10),
    unitSize: vector(0, 0),
    unitsVisible: vector(0, 0),
    // screenSize: vector(300, 150),
    // worldTL: vector(), // part of world borders
    // worldBR: vector(10, 10), // part of world borders
    // worldView: pos2(),
    // orientation: '',
    // unitWeight: vector(1, 1),
    // history: Array(10).fill(vector()),
});

// const setWorldView = (x: number, y: number, x2: number, y2: number) => {
// properties.worldView.x = x / properties.scale.x + properties.offset.x;
// properties.worldView.y = y / properties.scale.y + properties.offset.y;
// properties.worldView.x2 = x2 / properties.scale.x + properties.offset.x;
// properties.worldView.y2 = y2 / properties.scale.y + properties.offset.y;
// };

// const setScreenSize = (size: Vector) => {
//     properties.screenSize.x = size.x;
//     properties.screenSize.y = size.y;
// };
