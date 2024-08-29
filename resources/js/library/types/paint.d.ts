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

interface PaintShapes {
    circle: Circle;
    rectangle: Rectangle;
    line: Line;
    text: Txt;
    // These should be generated from other types:
    circleFill: Circle & Fill;
    circleStroke: Circle & Stroke;
    circleFillStroke: Circle & Fill & Stroke;
    //
    rectangleFill: Rectangle & Fill;
    rectangleStroke: Rectangle & Stroke;
    rectangleFillStroke: Rectangle & Fill & Stroke;
    // Text will need a lot of expansion, cause of placement and more (see transformedview and statistics show for examples)
    textFill: Txt & Fill;
    textStroke: Txt & Stroke;
    // Not default:
    textFillStroke: Txt & Fill & Stroke & TxtFull;
}

type PaintType = keyof PaintShapes;
