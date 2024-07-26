import type {Show, Update} from './engine';

type Button = {
    id: string | number;
    show: Show;
    update: Update;
    selfDestruct: () => void;
};

type ClickEvent = {
    evt: MouseEvent | TouchEvent;
    button: Button;
};

type ButtonType = 'fill' | 'stroke' | 'fillStroke' | 'fillStrokeRound';

type ButtonOptions = Partial<{
    id: number | string;
    name: string;
    type: ButtonType;
    x: number;
    y: number;
    w: number;
    h: number;
    lw: number;
    r: number;
    stroke: string;
    fill: string;
    text: string;
    textFill: ColorRGB;
    hoverFill: ColorRGB;
    font: string;
    click: (event: ClickEvent) => void;
}>;

type HoverProperties = {
    source: ColorRGB;
    target: ColorRGB;
    min: ColorRGB;
};

type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

// For future use (not yet implemented)
type ColorRGBA = ColorRGB & {a: number};

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'click'>> & {
    click?: (event: ClickEvent) => void;
};
