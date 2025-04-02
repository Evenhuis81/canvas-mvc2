import {TVMethods, TVProperties, TransformedView} from 'library/types/views';
import {createPaint} from './paint-index';
import {LibraryInput} from 'library/types/input';

export const createViews = (context: CanvasRenderingContext2D, input: LibraryInput): {tv: TransformedView} => {
    const tvProperties = createProperties();
    const methods = createMethods(tvProperties, input);
    const paint = createPaint(tvProperties, methods, context);

    const mouseInput = tvInput();

    return {tv: Object.assign(tvProperties, methods, {paint: paint})};
};

const createMethods = (props: TVProperties, input: LibraryInput): TVMethods => ({
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
    setScale: scale => {
        props.scale.x = scale.x;
        props.scale.y = scale.y;
    },
    setOffset: offset => {
        props.offset.x = offset.x;
        props.offset.y = offset.y;
    },
});

// const pos2 = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => ({x1, y1, x2, y2});
const pos = (x = 0, y = 0) => ({x, y});

const createProperties = (): TVProperties => ({
    // Core Properties:
    offset: pos(),
    scale: pos(1, 1),
    startPan: pos(),
    // scaleFactor: 0.95,
    // worldBeforeZoom: pos(),
    // worldAfterZoom: pos(),
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

// const w2S2 = (obj: TVPos2) => {
//     obj.oX1 = (obj.x1 - props.offset.x) * props.scale.x;
//     obj.oX1 = (obj.y1 - props.offset.y) * props.scale.y;
//     obj.oX1 = (obj.x2 - props.offset.x) * props.scale.x;
//     obj.oX1 = (obj.y2 - props.offset.y) * props.scale.y;
// };

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

// const setScaleFactor = (factor: number) => {
//     properties.scaleFactor = factor;
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
// s2W,
// w2S,
// setScale,
// setOffset,
// w2S2,
// setWorldView,
// setScaleFactor,
// setScreenSize,
// setDefaults,
// };
