import {getColorRGBA} from 'library/colors';

const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetButtonProperties = (options: ButtonOptions) => {
    props: InternalButtonProperties;
    handlers: InternalButtonHandlers;
    colors: InternalButtonColorAndTransitionProperties;
};

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

console.log(innerWidth, innerHeight);

const canvasScale = {
    x: innerWidth / 1690,
    y: innerHeight / 1080,
};

console.log(canvasScale.x, canvasScale.y);

// const calculatedProps = (unitWidth: number, unitHeight: number, props: ButtonProperties) => {}

const calculatedDefaultProperties: () => Omit<
    InternalButtonProperties,
    keyof InternalStaticButtonProperties | 'id'
> = () => ({
    name: 'noName',
    type: 'fillStrokeRound',
    text: 'NoText',
    font: 'monospace',
    delayShow: 0, // ms
    startTransition: true,
    endTransition: true,
    autoDestruct: true,
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
};

const staticDefaultProperties: InternalStaticButtonProperties = {
    pushed: false,
    destructed: false,
    destruct: false,
};

// Tho this is a static button, try set a scale value and adjust properties on resize with this scale value (scale according to innerWidth and innerHeight)
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
    ...colors, // spread is not copying nested properties (transition in this case)
});
const setHandlers = (handlers?: ButtonHandlers) => ({
    up: () => {},
    down: () => {},
    end: () => {},
    ...handlers, // could use a start handler eventually
});
