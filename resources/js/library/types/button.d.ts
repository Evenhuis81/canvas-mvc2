type Button = {
    id: number | string;
    selfDestruct: () => void;
    disable: () => void;
    activate: () => void;
    setEndTransition: (destruct: boolean) => void;
};

type ClickEvent = {
    evt: MouseEvent | TouchEvent;
    button: Button;
};

type ColorRGB = {
    r: number;
    g: number;
    b: number;
};

type ColorAndTransitionProperties = Record<TransitionTypes, ColorRGBA> & {
    transition: Record<TransitionTypes, ColorRGBA>;
};

type ColorValues = 'r' | 'g' | 'b' | 'a';

type ColorRGBA = ColorRGB & {a: number};

type TransitionTypes = 'fill' | 'stroke' | 'textFill';

type Transitions = {
    steps: number;
    on: (id: string) => void;
    off: (id: string) => void;
}[];

type Transition = {
    steps: number;
    forward: () => void;
    reverse: () => void;
};

type ButtonType = 'fill' | 'stroke' | 'fillStroke' | 'fillStrokeRound';

type ClickHandlers = {
    down: (event: ClickEvent) => void;
    up: (event: ClickEvent) => void;
    end: (event: Button) => void;
};

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
    fontSize: number;
    text: string;
    click: Partial<ClickHandlers>;
    color: Partial<ColorAndTransitionProperties>;
}>;

type InternalButtonProperties = Required<ButtonOptions>;

// & {
//     pushed: boolean;
//     destructed: boolean;
//     destruct: boolean;
//     // click: ClickHandlers;
//     // color: ColorAndTransitionProperties;
// };
