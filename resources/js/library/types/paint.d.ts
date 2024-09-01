type Position = {x: number; y: number};
type DoublePosition = {x1: number; y1: number; x2: number; y2: number};
type Circle = Position & {r: number};
type Rectangle = Position & {w: number; h: number};
type Line = DoublePosition & {lw: number};
type Txt = Position & {txt: string};

type Fnt = {font: string; fontSize: number};
type Fill = {fill: string};
type Stroke = {stroke: string; lw: number};

type FullShape<Type> = Type & Partial<Fill & Stroke>;
type FullFont<Type> = Type & Partial<Fnt>;

type Paint = <K extends keyof Shapes>(type: K, shape: Shapes[K]) => void;

// type PaintMethods = {[K in keyof PaintShapes]: () => (obj: PaintShapes[K]) => void};

// type Rect = {x: number; y: number; w: number; h: number};
// type Circle = {x: number; y: number; r: number};
// type FillRect = Rect & {fill: string};
// type StrokeRect = Rect & {stroke: string; lw: number};
// type FillStrokeRect = FillRect & {stroke: string; lw: number};
// type RoundFillStrokeRect = FillStrokeRect & {r: number};
// type Line = Omit<Vector2, 'add' | 'set' | 'setManual'> & {stroke: string; lw: number};
// type Text = {x: number; y: number; txt: string; font?: string; fill: string; fontSize?: number}; // auto-centered for now
// type StrokeCircle = Circle & {stroke: string; lw: number; rS: number; rE: number}; // rS: arc start, rE: arc end
// type FillCircle = Circle & {fill: string};
// type FillStrokeCircle = StrokeCircle & {fill: string};

// type NewPaintKey<T extends keyof PaintShapes> = `${T}fill`;

// type Shape = <S extends PaintShapes[keyof PaintShapes] | (PaintShapes[keyof PaintShapes] & Fill)>(
//     shape: S,
// ) => S extends {fill: string} ? PaintShapes[keyof PaintShapes] & Fill : PaintShapes[keyof PaintShapes];

interface Shapes {
    circle: Circle;
    rectangle: Rectangle;
    line: Line;
    text: FullFont<Txt>;
}

type ShapeKeys = Shapes[keyof Shapes];

// type BaseOrFill<T extends {fill: string} | PaintShapes> = T extends {fill: string} ? PaintShapes & Fill : PaintShapes;

// type PaintType = keyof PaintShapes;
