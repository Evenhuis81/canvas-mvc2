type TVRect = {x: number; y: number; w: number; h: number};
type TVCircle = {x: number; y: number; r: number};
type TVFillRect = TVRect & {fill: string};
type TVStrokeRect = TVRect & {stroke: string; lw: number};
type TVFillStrokeRect = TVFillRect & {stroke: string; lw: number};
type TVRoundFillStrokeRect = TVFillStrokeRect & {r: number};
type TVLine = Omit<Vector2, 'add' | 'set' | 'setManual'> & {stroke: string; lw: number};
type TVText = {x: number; y: number; txt: string; font?: string; fill: string; fontSize?: number}; // auto-centered for now
type TVStrokeCircle = TVCircle & {stroke: string; lw: number; rS: number; rE: number}; // rS: arc start, rE: arc end
type TVFillCircle = TVCircle & {fill: string};
type TVFillStrokeCircle = TVStrokeCircle & {fill: string};

type Paint = <K extends keyof Shapes>(type: K, shape: Shapes[K]) => void;

// type NewPaintKey<T extends keyof PaintShapes> = `${T}fill`;

// type Shape = <S extends PaintShapes[keyof PaintShapes] | (PaintShapes[keyof PaintShapes] & Fill)>(
//     shape: S,
// ) => S extends {fill: string} ? PaintShapes[keyof PaintShapes] & Fill : PaintShapes[keyof PaintShapes];

interface Shapes {
    circle: TVCircle;
    // rectangle: TVRectangle;
    // line: TVLine;
    // text: TVFullFont<Txt>;
}

// type ShapeKeys = Shapes[keyof Shapes];

// type BaseOrFill<T extends {fill: string} | PaintShapes> = T extends {fill: string} ? PaintShapes & Fill : PaintShapes;

// type PaintType = keyof PaintShapes;

// type Position = {x: number; y: number};
// type DoublePosition = {x1: number; y1: number; x2: number; y2: number};
// type Circle = Position & {r: number};
// type Rectangle = Position & {w: number; h: number};
// type Line = DoublePosition & {lw: number};
// type Txt = Position & {txt: string};
// type Fnt = {font: string; fontSize: number};
// type Fill = {fill: string};
// type Stroke = {stroke: string; lw: number};
// type FullShape<Type> = Type & Partial<Fill & Stroke>;
// type FullFont<Type> = Type & Partial<Fnt>;
// type PaintMethods = {[K in keyof PaintShapes]: () => (obj: PaintShapes[K]) => void};
