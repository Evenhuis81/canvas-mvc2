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
    textFill: string;
    hoverFill: string;
    font: string;
    click: (event: ClickEvent) => void;
}>;

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'click'>> & {
    click?: (event: ClickEvent) => void;
};
