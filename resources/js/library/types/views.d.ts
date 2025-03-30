import {EngineUpdate} from './engine';

export type LibraryViews = {};

type Zoom = 'in' | 'out';

export type TransformedView = {};
export type StaticView = {};

// type TransformedView = PropertiesTV & MethodsTV & PaintTV;

type LibraryGenericPaintMethods<Methods extends object> = {
    [K in keyof Methods]: (
        props: PropertiesTV,
        methods: MethodsTV,
        context: CanvasRenderingContext2D,
    ) => (...args: unknown[]) => void;
};

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

interface MethodsTV {
    screen2World: (x: number, y: number) => void;
    world2Screen: (x: number, y: number) => void;
    world2Screen2: (x1: number, y1: number, x2: number, y2: number) => {x1: number; y1: number; x2: number; y2: number};
    zoomMechanic: {
        in: () => void;
        out: () => void;
    };
    zoom: (scalePos: Vector, type: Zoom) => void;
    getMiddleScreen: () => Vector;
    setWorldView: (x: number, y: number, x2: number, y2: number) => void;
    setScale: (scale: Vector) => void;
    setScaleFactor: (factor: number) => void;
    setScreenSize: (size: Vector) => void;
    setWorldBorders: (borders: Vector2) => void;
    setOffset: (offset: Vector) => void;
    setDefaults: (canvas: HTMLCanvasElement) => void;
    // getGrid: (context: CanvasRenderingContext2D) => Draw;
    setMiddle: (target: Vector) => void;
    moveTo: (target: Vector, slowR?: number) => EngineUpdate;
    setUnitWeight: (unitLw: Vector) => void;
    delay: (lastPos: Vector, pos: Vector) => void;
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
