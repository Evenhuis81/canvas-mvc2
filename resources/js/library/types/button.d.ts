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

type TransitionTypes = 'fill' | 'stroke' | 'textFill';

type ColorAndTransitionProperties = Record<TransitionTypes, ColorRGBA> & {
    transition: Record<TransitionTypes, ColorRGBA>;
};

type ColorValues = 'r' | 'g' | 'b' | 'a';

type Transitions = {
    steps: number;
    on: (id: string) => void;
    off: (id: string) => void;
}[];

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
    font: string;
    text: string;
    click: (event: ClickEvent) => void;
}>;

type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

type ColorRGBA = ColorRGB & {a: number};

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'click'>> & {
    click?: (event: ClickEvent) => void;
    pushed: boolean;
    destructed: boolean;
    color: ColorAndTransitionProperties;
    transitionSteps?: number;
};
