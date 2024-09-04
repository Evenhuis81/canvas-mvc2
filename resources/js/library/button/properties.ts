import {getColorRGBA} from 'library/colors';
import {getProperties, uid} from 'library/helpers';

const setTransits = (transits?: Transitions) => ({});

// export const getButtonProperties = (options: Partial<ButtonOptions>) => {
//     const {click: handlers, colors, transitions, ...restProperties} = options;

//     const properties = getProperties(staticDefaultButtonProperties, restProperties, calculatedDefaultButtonProperties);

//     return {
//         props: setProps(properties),
//         handlers: setHandlers(handlers),
//         colors: setColors(colors),
//         transits: setTransits(transitions),
//     };
export const getButtonProperties = (
    options: ButtonOptions,
    defaults: typeof staticDefaultButtonProperties,
    calculatedOptions?: () => ButtonProperties,
) => {
    const {click: handlers, colors, ...restProperties} = options;

    const properties = getProperties(restProperties, defaults);

    // if (calculatedOptions) Object.assign(properties, calculatedOptions());

    return {props: setProps(properties), handlers: setHandlers(handlers), colors: setColors(colors)};
};

const setProps: (props: ButtonProperties) => ButtonProperties = props => ({
    ...staticDefaultButtonProperties,
    ...calculatedDefaultButtonProperties(),
    ...props,
});

export const calculatedDefaultButtonProperties = () => ({
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    lw: 2,
    fontSize: 16,
});

export const staticDefaultButtonProperties = {
    id: `button ${uid()}`,
    name: 'No Name',
    text: 'Button',
    font: 'monospace',
    r: 5,
    pushed: false,
    destructed: false,
    destruct: false,
    hover: false,
    hoverTransition: 'none',
    delay: 0,
    start: false,
    startTransition: 'none',
    end: false,
    endTransition: 'none',
    autoDestruct: true,
};

const setColors = (colors?: ButtonColors) => ({
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
    ...handlers,
});
