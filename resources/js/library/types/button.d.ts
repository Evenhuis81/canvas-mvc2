type Button = {
    id: number | string;
    selfDestruct: () => void;
    disable: () => void;
    activate: () => void;
    // setStartTransition: () => void;
    // setEndTransition: (destruct?: boolean) => void;
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

type ColorRGBA = ColorRGB & {a: number};

type ButtonColors = Record<keyof ColorRGBA, ColorRGBA>;

// type ButtonColors = Record<ButtonColorTypes, ColorRGBA>> & {
//     transition: Record<ButtonColorTypes, ColorRGBA>;
// };

// type ButtonType = 'fill' | 'stroke' | 'fillStroke' | 'fillStrokeRound';

type ButtonHandlers = {
    down: (event: ClickEvent) => void;
    up: (event: ClickEvent) => void;
    end: (event: Button) => void;
};

type ButtonOptions = {
    id: number | string;
    name: string;
    x: number;
    y: number;
    w: number;
    h: number;
    lw: number;
    r: number;
    font: string;
    fontSize: number;
    text: string;
    autoDestruct: boolean;
    click: ButtonHandlers;
    colors: ButtonColors;
    transitions: Transitions;
};

type ButtonProperties = Omit<ButtonOptions, 'click' | 'colors' | 'transitions'> & {
    pushed: boolean;
    destruct: boolean;
    destructed: boolean;
};

// type InternalButtonProperties = ButtonProperties & {
//     pushed: boolean;
//     destruct: boolean;
//     destructed: boolean;
// };

// type InternalButtonHandlers = Required<ButtonHandlers>;

// type InternalButtonColors = Required<ButtonColors>;

// type GetButtonProperties = (
//     options: ButtonOptions,
//     calculatedOptions?: () => ButtonOptions,
// ) => {
//     props: InternalButtonProperties;
//     handlers: InternalButtonHandlers;
//     colors: InternalButtonColors;
// };

// type InternalStaticButtonProperties = {
//     name: string;
//     pushed: boolean;
//     destructed: boolean;
//     destruct: boolean;
//     autoDestruct: boolean;
//     delay: number;
//     r: number;
//     font: string;
//     text: string;
// };
