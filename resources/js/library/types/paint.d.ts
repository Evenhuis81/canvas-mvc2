type Position = {x: number; y: number};
type DoublePosition = {x1: number; y1: number; x2: number; y2: number};
type Circle = Position & {r: number};
type Rectangle = Position & {w: number; h: number};
type Line = DoublePosition & {lw: number};
type Txt = Position & {txt: string}; // First Shape with optional properties, need testing on generic methods

// type FillRect = Rect & {fill: string};
// type StrokeRect = Rect & {stroke: string; lw: number};
// type FillStrokeRect = FillRect & {stroke: string; lw: number};
// type RoundFillStrokeRect = FillStrokeRect & {r: number};
// type Line = Omit<Vector2, 'add' | 'set' | 'setManual'> & {stroke: string; lw: number};
// type Text = {x: number; y: number; txt: string; font?: string; fill: string; fontSize?: number}; // auto-centered for now
// type StrokeCircle = Circle & {stroke: string; lw: number; rS: number; rE: number}; // rS: arc start, rE: arc end
// type FillCircle = Circle & {fill: string};
// type FillStrokeCircle = StrokeCircle & {fill: string};

interface PaintShapes {
    circle: Circle;
    rectangle: Rectangle;
    line: Line;
    text: Txt;
}

// type PaintType = 'circle' | 'rectangle' | 'line' | 'text';
type PaintType = keyof PaintShapes;
