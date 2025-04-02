import {TVMethods, TVProperties, TransformedView} from 'library/types/views';
import {createPaint} from './paint-index';
import {LibraryInput} from 'library/types/input';
import {createInputTV} from './input';

export const createViews = (context: CanvasRenderingContext2D, input: LibraryInput): {tv: TransformedView} => {
    const tvProperties = createProperties();
    const methods = createMethods(tvProperties);
    const paint = createPaint(tvProperties, methods, context);

    const inputTV = createInputTV(tvProperties, methods, input);

    return {tv: Object.assign(tvProperties, methods, {paint}, inputTV)};
};

const createMethods = (props: TVProperties): TVMethods => ({
    s2W: (x, y) => ({
        xT: x / props.scale.x + props.offset.x,
        yT: y / props.scale.y + props.offset.y,
    }),
    w2S: (xT, yT) => ({
        x: (xT - props.offset.x) * props.scale.x,
        y: (yT - props.offset.y) * props.scale.y,
    }),
    w2S2: (xT1, yT1, xT2, yT2) => ({
        x1: (xT1 - props.offset.x) * props.scale.x,
        y1: (yT1 - props.offset.y) * props.scale.y,
        x2: (xT2 - props.offset.x) * props.scale.x,
        y2: (yT2 - props.offset.y) * props.scale.y,
    }),
    setScale: scale => (props.scale = scale),
    setOffset: offset => (props.offset = offset),
    screenMiddle: () => pos(context.canvas.width / 2, properties.screenSize.y / 2),
});

// const pos2 = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => ({x1, y1, x2, y2});
const pos = (x = 0, y = 0) => ({x, y});
const worldPos = (xT = 0, yT = 0) => ({xT, yT});

const createProperties = (): TVProperties => ({
    // Core Properties:
    offset: pos(),
    scale: pos(1, 1),
    startPan: pos(),
    scaleFactor: pos(0.95, 0.95),
    worldBeforeZoom: worldPos(),
    worldAfterZoom: worldPos(),
    // screen: pos(),
    // screen2: vector2(),
    // world: pos(10, 10),
    // screenSize: pos(300, 150),
    // worldTL: pos(), // part of world borders
    // worldBR: pos(10, 10), // part of world borders
    // worldView: pos2(),
    // orientation: '',
    // unitWeight: pos(1, 1),
    // history: Array(10).fill(pos()), // separate
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

// const setDefaults = (canvas: HTMLCanvasElement) => {
//     const {width, height} = canvas;

//     let scaleXY: number;

//     if (width > height) {
//         scaleXY = height / 12;
//         properties.orientation = 'landscape';
//     } else {
//         scaleXY = width / 12;
//         properties.orientation = 'portrait';
//     }

//     setScale(vector(scaleXY, scaleXY));
//     setScaleFactor(0.9);
//     setScreenSize(vector(width, height));
// };

// const methods = {
// setWorldView,
// setScreenSize,
// setDefaults,
// };
