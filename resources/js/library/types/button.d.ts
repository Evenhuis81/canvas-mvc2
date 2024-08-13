type Button = {
    id: number | string;
    selfDestruct: () => void;
    disable: () => void;
    activate: () => void;
    setEndTransition: (destruct?: boolean) => void;
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

type ButtonColorAndTransitionProperties = Record<ButtonColorTypes, ColorRGBA> & {
    transition: Record<ButtonColorTypes, ColorRGBA>;
};

type ColorValues = 'r' | 'g' | 'b' | 'a';

type ColorRGBA = ColorRGB & {a: number};

type ButtonColorTypes = 'fill' | 'stroke' | 'textFill';

// These 2 = bad
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

type ButtonHandlers = {
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
    endTransition: boolean;
    autoDestruct: boolean;
    handlers: Partial<ButtonHandlers>;
    colors: Partial<ButtonColorAndTransitionProperties>;
}>;

type ButtonProperties = Omit<ButtonOptions, 'handlers' | 'colors'>;

type InternalButtonProperties = Required<ButtonProperties> & {
    pushed: boolean;
    destructed: boolean;
    destruct: boolean;
};
