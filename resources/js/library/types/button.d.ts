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
    click: {
        down?: (event: ClickEvent) => void;
        up?: (event: ClickEvent) => void;
        end?: (event: Button) => void;
    };
}>;

type InternalButtonProperties = Required<Omit<ButtonOptions, 'click'>> & {
    click?: ButtonOptions['click'];
    pushed: boolean;
    destructed: boolean;
    destruct: boolean;
    color: ColorAndTransitionProperties;
    endTransition: {};
};
