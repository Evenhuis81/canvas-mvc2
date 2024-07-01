import type {Show, Update} from './engine';

type Button = {
    show: Show;
    update: Update;
    getTextProperties: () => {width: number};
};

type ButtonType = 'fill' | 'stroke' | 'fillStroke';

type ButtonOptions = {
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
    textColor?: string;
    font?: string;
    mouseup?: (ev: MouseEvent) => void;
};

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'mouseup'>> & {mouseup?: (ev: MouseEvent) => void};
