import {getColorRGBA} from 'library/colors';
import {uid} from 'library/helpers';

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

const staticDefaultProperties: InternalStaticButtonProperties = {
    pushed: false,
    destructed: false,
    destruct: false,
    name: 'noName',
    type: 'fillStrokeRound',
    text: 'NoText',
    font: 'monospace',
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
