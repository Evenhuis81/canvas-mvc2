import type {Show, Update} from './engine';

type Button = {
    id: string | number;
    show: Show;
    update: Update;
    selfDestruct: () => void;
};

type ButtonType = 'fill' | 'stroke' | 'fillStroke' | 'fillStrokeRound';

type ButtonOptions = {
    id?: number | string;
    name?: string;
    type?: ButtonType;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    lw?: number;
    r?: number;
    stroke?: string;
    fill?: string;
    text?: string;
    textFill?: string;
    hoverFill?: string;
    font?: string;
    mouseup?: (ev: MouseEvent) => void;
};

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'mouseup'>> & {
    mouseup?: (ev: MouseEvent) => void;
};
