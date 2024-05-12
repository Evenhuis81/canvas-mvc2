import {Update, Vector, Vector2} from 'games/tombraid/types/game';

type Rect = {x: number; y: number; w: number; h: number};
type FillRect = Rect & {fill: string};
type StrokeRect = Rect & {stroke: string; lw: number};
type FillStrokeRect = FillRect & {stroke: string; lw: number};
type RoundFillStrokeRect = FillStrokeRect & {r: number};
type Line = Vector2 & {stroke: string; lw: number};
type Text = {x: number; y: number; txt: string; font: string; fill: string}; // auto-centered for now

type Zoom = 'in' | 'out';

export interface TransformedView {
    worldClamp: Vector2;
    update: Update;
    fillRect: (obj: FillRect) => void;
    strokeRect: (obj: StrokeRect) => void;
    line: (obj: Line) => void;
    text: (obj: Text) => void;
    roundFillStrokeRect: (obj: RoundFillStrokeRect) => void;
}

export type TVOptions = {
    context: CanvasRenderingContext2D;
    screenSize: Vector;
    worldBorders?: Vector2;
    offset?: Vector;
    scale?: Vector;
    showWorldBorders?: boolean;
    showGrid?: number;
};
