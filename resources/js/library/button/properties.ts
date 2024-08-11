import {getColorRGBA} from 'library/colors';
import {ButtonOptions, InternalButtonOptions} from 'library/types/button';

// mediocre uid imho
const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const getButtonProperties: (options: ButtonOptions) => InternalButtonOptions = options => ({
    id: options.id ? 'noID' : uid(),
    name: 'noName',
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.2,
    h: innerHeight * 0.05,
    color: {
        fill: getColorRGBA(0, 0, 0, 1),
        stroke: getColorRGBA(255, 0, 0, 1),
        textFill: getColorRGBA(255, 255, 255, 1),
        transition: {
            fill: getColorRGBA(100, 100, 100, 1),
            stroke: getColorRGBA(155, 0, 0, 1),
            textFill: getColorRGBA(0, 255, 0, 1),
        },
    },
    text: 'NoText',
    lw: 2,
    r: 5,
    font: 'monospace',
    fontSize: 10,
    pushed: false,
    destructed: false,
    endTransition: {},
    ...options,
});
