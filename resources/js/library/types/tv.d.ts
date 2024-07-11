import {Show, Update} from './engine';
import {Statistic} from './statistics';
import {Vector, Vector2} from './vector';

type Rect = {x: number; y: number; w: number; h: number};
type Circle = {x: number; y: number; r: number};
type FillRect = Rect & {fill: string};
type StrokeRect = Rect & {stroke: string; lw: number};
type FillStrokeRect = FillRect & {stroke: string; lw: number};
type RoundFillStrokeRect = FillStrokeRect & {r: number};
type Line = Omit<Vector2, 'add' | 'set' | 'setManual'> & {stroke: string; lw: number};
type Text = {x: number; y: number; txt: string; font?: string; fill: string; fontSize?: number}; // auto-centered for now
type StrokeCircle = Circle & {stroke: string; lw: number; rS: number; rE: number}; // rS: arc start, rE: arc end
type FillCircle = Circle & {fill: string};
type FillStrokeCircle = StrokeCircle & {fill: string};
type Zoom = 'in' | 'out';

export interface TransformedView extends PropertiesTV, PaintTV, MethodsTV {
    // setTVStatistics: () => Statistic[];
}

export interface PaintTV {
    fillRect: (obj: FillRect) => void;
    strokeRect: (obj: StrokeRect) => void;
    line: (obj: Line) => void;
    text: (obj: Text) => void;
    fillStrokeRect: (obj: FillStrokeRect) => void;
    roundFillStrokeRect: (obj: RoundFillStrokeRect) => void;
    fillCircle: (obj: FillCircle) => void;
    strokeCircle: (obj: StrokeCircle) => void;
    fillStrokeCircle: (obj: FillStrokeCircle) => void;
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
    setDefaults: (canvas: HTMLCanvasElement) => void;
    // getGrid: (context: CanvasRenderingContext2D) => Show;
    setMiddle: (target: Vector) => void;
    moveTo: (target: Vector, slowR?: number) => Update;
    setUnitWeight: (unitLw: Vector) => void;
}

export type PropertiesTV = {
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
};
