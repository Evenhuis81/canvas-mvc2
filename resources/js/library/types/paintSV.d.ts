export type Rect = {x: number; y: number; w: number; h: number};
export type Circle = {x: number; y: number; r: number};
export type Line = {x1: number; y1: number; x2: number; y2: number};
export type Text = {x: number; y: number; txt: string};

type Fill = {fill: string}; // make fill a type
type Stroke = {stroke: string; lw: number};

export type FillRect = Rect & Fill;
export type StrokeRect = Rect & Stroke;
export type FillStrokeRect = Rect & Stroke & Rect; // StrokeFill needed?
export type FillCircle = Circle & Fill;
// export type RoundFillStrokeRect = FillStrokeRect & {r: number};
// export type StrokeCircle = Circle & {stroke: string; lw: number; rS: number; rE: number}; // rS: arc start, rE: arc end
// export type FillStrokeCircle = StrokeCircle & {fill: string};
