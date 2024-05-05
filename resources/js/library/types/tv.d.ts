import {Vector, Vector2} from 'types/game';

export type StrokeRectObj = {x: number; y: number; w: number; h: number; color: string};
export type FillRectObj = StrokeRectObj;
export type StrokeRoundRectObj = StrokeRectObj & {r: number};
export type LineObj = {x: number; y: number; x2: number; y2: number; s: number};
export type TextObj = {txt: string; x: number; y: number};

type Zoom = 'in' | 'out';

export type StrokeRect = (obj: StrokeRectObj) => void;
export type FillRect = (obj: FillRectObj) => void;
export type StrokeRoundRect = (obj: StrokeRoundRectObj) => void;
export type Line = (obj: LineObj) => void;
export type Text = (obj: TextObj) => void;

export type TVOptions = {
    context: CanvasRenderingContext2D;
    screenSize: Vector;
    worldBorders?: Vector2;
    offset?: Vector;
    scale?: Vector;
    showWorldBorders?: boolean;
    showGrid?: number;
};

export interface TransformedView {
    fillRect: FillRect;
    strokeRect: StrokeRect;
    strokeRoundRect: StrokeRoundRect;
    line: Line;
    text: Text;
}
