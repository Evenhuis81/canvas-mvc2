import {Vector, Vector2} from '.';

type Rect = {x: number; y: number; w: number; h: number};
type FillRect = Rect & {fill: string};
type StrokeRect = Rect & {stroke: string; lw: number};
type FillStrokeRect = FillRect & {stroke: string; lw: number};
type RoundFillStrokeRect = FillStrokeRect & {r: number};
type Line = Omit<Vector2, 'add' | 'set' | 'setManual'> & {stroke: string; lw: number};
type Text = {x: number; y: number; txt: string; font: string; fill: string}; // auto-centered for now
type FillCircle = {x: number; y: number; r: number; fill: string};
type Zoom = 'in' | 'out';

export interface TransformedView extends PropertiesTV, PaintTV, MethodsTV {}

export interface PaintTV {
    fillRect: (obj: FillRect) => void;
    strokeRect: (obj: StrokeRect) => void;
    line: (obj: Line) => void;
    text: (obj: Text) => void;
    fillStrokeRect: (obj: FillStrokeRect) => void;
    roundFillStrokeRect: (obj: RoundFillStrokeRect) => void;
    fillCircle: (obj: FillCircle) => void;
}

export interface MethodsTV {
    screen2World: (x: number, y: number) => void;
    world2Screen: (x: number, y: number) => void;
    world2Screen2: (x: number, y: number, x2: number, y2: number) => void;
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
}

export type PropertiesTV = {
    offset: Vector;
    scale: Vector;
    screen: Vector2;
    world: Vector;
    screenSize: Vector;
    worldTL: Vector;
    worldBR: Vector;
    startPan: Vector;
    worldBeforeZoom: Vector;
    worldAfterZoom: Vector;
    scaleFactor: number;
    worldView: Vector2;
};
