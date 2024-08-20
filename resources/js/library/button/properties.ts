import {getColorRGBA} from 'library/colors';
import {uid} from 'library/helpers';

export const getButtonProperties: GetButtonProperties = (options, calculatedOptions) => {
    const {click: handlers, colors, ...properties} = options;

    if (calculatedOptions) Object.assign(properties, calculatedOptions());

    return {props: setProps(properties), handlers: setHandlers(handlers), colors: setColors(colors)};
};

const setProps: (props: ButtonProperties) => InternalButtonProperties = props => ({
    ...calculatedDefaultProperties(),
    ...staticDefaultProperties,
    ...props,
    id: props.id ?? `button ${uid()}`,
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
    fontSize: 16,
});

const staticDefaultProperties: InternalStaticButtonProperties = {
    pushed: false,
    destructed: false,
    destruct: false,
    name: 'Example Button',
    type: 'fillStrokeRound',
    text: 'Example Button',
    font: 'monospace',
    r: 5,
    delay: 0, // ms
    startTransition: true,
    endTransition: true,
    autoDestruct: true,
};

const setColors = (colors?: ButtonColorAndTransitionProperties) => ({
    fill: getColorRGBA(0, 0, 0, 1),
    stroke: getColorRGBA(255, 0, 0, 1),
    textFill: getColorRGBA(255, 255, 255, 1),
    transition: {
        fill: getColorRGBA(25, 25, 25, 1),
        stroke: getColorRGBA(155, 0, 0, 1),
        textFill: getColorRGBA(0, 255, 0, 1),
    },
    ...colors,
});
const setHandlers = (handlers?: ButtonHandlers) => ({
    up: () => {},
    down: () => {},
    end: () => {},
    ...handlers, // could use a start handler eventually
});
