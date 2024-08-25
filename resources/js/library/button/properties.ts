import {getColorRGBA} from 'library/colors';
import {getProperties, uid} from 'library/helpers';

// const defaults = {
//     id: 'defaultID',
// };

// const options = {
//     id: 'newID',
// };

// const properties = getProperties(defaults, options);

export const getButtonProperties = (
    options: ButtonOptions,
    defaults: typeof staticDefaultButtonProperties,
    calculatedOptions?: () => typeof calculatedDefaultButtonProperties,
) => {
    const {click: handlers, colors, ...restProperties} = options;

    const properties = getProperties(restProperties, defaults, calculatedOptions);

    // if (calculatedOptions) Object.assign(properties, calculatedOptions());

    return {props: setProps(properties), handlers: setHandlers(handlers), colors: setColors(colors)};
};

const setProps: (props: ButtonProperties) => InternalButtonProperties = props => ({
    ...calculatedDefaultButtonProperties(),
    ...staticDefaultButtonProperties,
    ...props,
    id: props.id ?? `button ${uid()}`,
});

// export const calculatedDefaultProperties: () => Omit<
//     InternalButtonProperties,
//     keyof InternalStaticButtonProperties | 'id'
// > = () => ({
export const calculatedDefaultButtonProperties = () => ({
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    lw: 2,
    fontSize: 16,
});

// const staticDefaultProperties: InternalStaticButtonProperties = {
export const staticDefaultButtonProperties = {
    name: 'Example Button',
    type: 'fillStrokeRound',
    text: 'Example Button',
    font: 'monospace',
    r: 5,
    pushed: false,
    destructed: false,
    destruct: false,
    startTransition: true,
    delay: 0, // ms
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
