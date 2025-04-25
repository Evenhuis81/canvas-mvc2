import {Pos, Pos2} from './shapes';

type TVProperties = {
    offset: Pos;
    scale: Pos;
    startPan: Pos;
    scaleMouse: number;
    scaleKeyboard: number;
    worldBeforeZoom: WorldPos;
    worldAfterZoom: WorldPos;
    tiles: Pos;
    // tileSize: Pos;
    tilesVisible: Pos;
};

type TVMethods = {
    screen2World: (x: number, y: number) => WorldPos;
    world2Screen: (xT: number, yT: number) => ScreenPos;
    world2Screen2: (xT1: number, yT1: number, xT2: number, yT2: number) => ScreenPos2;
    setScale: (scale: Pos) => void;
    setOffset: (offset: Pos) => void;
    screenMiddle: () => Pos;
    setTileProperties: (tilesX: number, tilesY: number, tilesVisibleX: number, tilesVisibleY: number) => void;
};

type TVPaint = {
    line: (x1: number, y1: number, x2: number, y2: number) => void;
    roundRectStroke: (
        x: number,
        y: number,
        w: number,
        h: number,
        strokeStyle: string,
        lineWidth: number,
        radii: number,
    ) => void;
    imageTileRotation: (tri: ImageRotate) => void;
    triangle: (x: number, y: number, fillStyle: string, strokeStyle: string, lineWidth: number) => void;
};

export type ImageRotate = {
    img: HTMLImageElement;
    x: number;
    y: number;
    angle: number;
};

export type TransformedView = TVProperties &
    TVMethods & {
        paint: TVPaint;
        mouseInput: {
            activate: () => void;
            deactivate: () => void;
        };
        keyboardInput: {
            activate: () => void;
            deactivate: () => void;
        };
    };

export type WorldPos = {xT: number; yT: number};
export type ScreenPos = Pos;
export type ScreenPos2 = Pos2;
// export type WorldPos2 = {xT1: number; yT1: number; xT2: number; yT2: number};
// export type TVPos = Pos & TransformedPos;
// export type TVPos2 = Pos2 & TransformedPos2;

// type TestF = (...args: any[]) => void;

// type CreatePaintDraw<F extends TestF> = (
//     properties: PropertiesTV,
//     methods: MethodsTV,
//     ctx: CanvasRenderingContext2D,
// ) => F;

// export type SetPaint = <T extends string, F extends TestF>(name: T, draw: CreatePaintDraw<F>) => void;

// type LibraryGenericPaintMethods<Methods extends object, K extends unknown[]> = {
//     [K in keyof Methods]: (
//         props: PropertiesTV,
//         methods: MethodsTV,
//         context: CanvasRenderingContext2D,
//     ) => (...args: K[]) => void;
// };

export interface PaintTV {
    fillRect: (obj: TVFillRect) => void;
    strokeRect: (obj: TVStrokeRect) => void;
    // line: (obj: TVLine) => void;
    line: (x1: number, y1: number, x2: number, y2: number) => void;
    text: (obj: TVText) => void;
    fillStrokeRect: (obj: TVFillStrokeRect) => void;
    roundFillStrokeRect: (obj: TVRoundFillStrokeRect) => void;
    roundRectStroke: (x: number, y: number, w: number, h: number, radii: number) => void;
    fillCircle: (obj: TVFillCircle) => void;
    strokeCircle: (obj: TVStrokeCircle) => void;
    fillStrokeCircle: (obj: TVFillStrokeCircle) => void;
}

// TODO::Simplify and abstract to different themes
interface MethodsTV {
    screen2World: (x: number, y: number) => void;
    world2Screen: (x: number, y: number) => void;
    world2Screen2: (x1: number, y1: number, x2: number, y2: number) => {x1: number; y1: number; x2: number; y2: number};
    // zoomMechanic: {
    //     in: () => void;
    //     out: () => void;
    // };
    // zoom: (scalePos: Vector, type: Zoom) => void;
    // getMiddleScreen: () => Vector;
    // setWorldView: (x: number, y: number, x2: number, y2: number) => void;
    setScale: (scale: Vector) => void;
    setScaleFactor: (factor: number) => void;
    setScreenSize: (size: Vector) => void;
    // setWorldBorders: (borders: Vector2) => void;
    setOffset: (offset: Vector) => void;
    // setDefaults: (canvas: HTMLCanvasElement) => void;
    // setMiddle: (target: Vector) => void;
    // moveTo: (target: Vector, slowR?: number) => EngineUpdate;
    // setUnitWeight: (unitLw: Vector) => void;
    // delay: (lastPos: Vector, pos: Vector) => void;
    // getGrid: (context: CanvasRenderingContext2D) => Draw;
}

interface PropertiesTV {
    offset: Vector;
    scale: Vector;
    screen: Vector;
    screen2: Vector2;
    world: Vector;
    screenSize: Vector;
    worldTL: Vector;
    worldBR: Vector;
    startPan: Vector;
    worldBeforeZoom: Vector;
    worldAfterZoom: Vector;
    scaleFactor: number;
    worldView: Vector2;
    unitWeight: Vector;
}
