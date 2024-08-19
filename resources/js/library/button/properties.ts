import {getColorRGBA} from 'library/colors';

const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const getButtonProperties: GetButtonProperties = options => {
    const {handlers, colors, ...properties} = options;

    return {props: setProps(properties), handlers: setHandlers(handlers), colors: setColors(colors)};
};

const setProps: (props: ButtonProperties) => InternalButtonProperties = props => ({
    ...calculatedDefaultProperties(),
    ...staticDefaultProperties,
    ...props,
    id: props.id ?? uid(),
});

const calculatedDefaultProperties: () => Omit<
    InternalButtonProperties,
    keyof InternalStaticButtonProperties | 'id'
> = () => ({
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    lw: 2,
    r: 5,
    fontSize: 10,
});

type InternalStaticButtonProperties = {
    pushed: boolean;
    destructed: boolean;
    destruct: boolean;
    name: string;
    type: ButtonType;
    text: string;
    font: string;
    delayShow: number; // ms
    startTransition: boolean;
    endTransition: boolean;
    autoDestruct: boolean;
};

const staticDefaultProperties: InternalStaticButtonProperties = {
    pushed: false,
    destructed: false,
    destruct: false,
    name: 'noName',
    type: 'fillStrokeRound',
    text: 'NoText',
    font: 'monospace',
    delayShow: 0, // ms
    startTransition: true,
    endTransition: true,
    autoDestruct: true,
};

const calcProps = () => ({
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    lw: 2,
    r: 5,
    fontSize: 10,
});

const setColors = (colors?: ButtonColorAndTransitionProperties) => ({
    fill: getColorRGBA(0, 0, 0, 1),
    stroke: getColorRGBA(255, 0, 0, 1),
    textFill: getColorRGBA(255, 255, 255, 1),
    transition: {
        fill: getColorRGBA(100, 100, 100, 1),
        stroke: getColorRGBA(155, 0, 0, 1),
        textFill: getColorRGBA(0, 255, 0, 1),
    },
    ...colors, // spread is not copying nested properties
});
const setHandlers = (handlers?: ButtonHandlers) => ({
    up: () => {},
    down: () => {},
    end: () => {},
    ...handlers, // could use a start handler eventually
});
