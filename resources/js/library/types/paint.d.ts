type Position = {x: number; y: number};
type DoublePosition = {x1: number; y1: number; x2: number; y2: number};
type Circle = Position & {r: number};
type Rectangle = Position & {w: number; h: number};
type Line = DoublePosition & {lw: number};
type Txt = Position & {txt: string};

type TxtFull = Txt & {font: string; fontSize: number};
type Fill = {fill: string};
type Stroke = {stroke: string; lw: number};
// Create Shape with optional propertiesand usiong generic

type Paint = <K extends keyof PaintShapes>(type: K, shape: PaintShapes[K]) => void;

export interface StaticView {
    paint: Paint;
}

export interface PaintMethods {
    // fillRect: (obj: FillRect) => void;
    // strokeRect: (obj: StrokeRect) => void;
    rect: (obj: Rectangle) => void;
    circle: (obj: Circle) => void;
    line: (obj: Line) => void;
    text: (obj: Text) => void;
    // fillStrokeRect: (obj: FillStrokeRect) => void;
    // roundFillStrokeRect: (obj: RoundFillStrokeRect) => void;
    // fillCircle: (obj: FillCircle) => void;
    // strokeCircle: (obj: StrokeCircle) => void;
    // fillStrokeCircle: (obj: FillStrokeCircle) => void;
}

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

interface PaintShapes {
    circle: Circle;
    rectangle: Rectangle;
    line: Line;
    text: Txt;
    // These should be generated from other types:
    // circleFill: Circle & Fill;
    // circleStroke: Circle & Stroke;
    // circleFillStroke: Circle & Fill & Stroke;
    // rectangleFill: Rectangle & Fill;
    // rectangleStroke: Rectangle & Stroke;
    // rectangleFillStroke: Rectangle & Fill & Stroke;
    // Text will need a lot of expansion, cause of placement and more (see transformedview and statistics show for examples)
    // textFill: Txt & Fill;
    // textStroke: Txt & Stroke;
    // Not default:
    // textFillStroke: Txt & Fill & Stroke & TxtFull;
}

type PaintType = keyof PaintShapes;
