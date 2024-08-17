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
    id: props.id ? 'noID' : uid(),
    name: 'noName',
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    text: 'NoText',
    lw: 2,
    r: 5,
    font: 'monospace',
    fontSize: 10,
    pushed: false,
    destructed: false,
    destruct: false,
    delayShow: 0, // ms
    startTransition: true,
    endTransition: true,
    autoDestruct: true,
    ...props,
});

// Tho this is a static button, try set a scale value and adjust properties on resize with this scale value (scale according to innerWidth and innerHeight)
// const calcProps = () => ({
//     x: innerWidth * 0.5,
//     y: innerHeight * 0.1,
//     w: innerWidth * 0.2,
//     h: innerHeight * 0.05,
// })

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
