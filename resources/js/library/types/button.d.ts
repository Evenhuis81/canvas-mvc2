type Button = {
    id: number | string;
    selfDestruct: () => void;
    disable: () => void;
    activate: () => void;
    setStartTransition: () => void;
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

type ColorValues = 'r' | 'g' | 'b' | 'a';

type ColorRGBA = ColorRGB & {a: number};

type ButtonColorTypes = 'fill' | 'stroke' | 'textFill';

type ButtonColorAndTransitionProperties = Partial<Record<ButtonColorTypes, ColorRGBA>> & {
    transition: Record<ButtonColorTypes, ColorRGBA>;
};

type ButtonType = 'fill' | 'stroke' | 'fillStroke' | 'fillStrokeRound';

type ButtonHandlers = {
    down?: (event: ClickEvent) => void;
    up?: (event: ClickEvent) => void;
    end?: (event: Button) => void;
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
    delay: number;
    startTransition: boolean;
    endTransition: boolean;
    autoDestruct: boolean;
    handlers: ButtonHandlers;
    colors: ButtonColorAndTransitionProperties;
}>;

type ButtonProperties = Omit<ButtonOptions, 'handlers' | 'colors'>;

type InternalButtonProperties = Required<ButtonProperties> & {
    pushed: boolean;
    destructed: boolean;
    destruct: boolean;
};

type InternalButtonHandlers = Required<ButtonHandlers>;

type InternalButtonColorAndTransitionProperties = Required<ButtonColorAndTransitionProperties>;

type GetButtonProperties = (options: ButtonOptions) => {
    props: InternalButtonProperties;
    handlers: InternalButtonHandlers;
    colors: InternalButtonColorAndTransitionProperties;
};

type InternalStaticButtonProperties = {
    pushed: boolean;
    destructed: boolean;
    destruct: boolean;
    name: string;
    type: ButtonType;
    text: string;
    font: string;
    delay: number; // ms
    startTransition: boolean;
    endTransition: boolean;
    autoDestruct: boolean;
};
