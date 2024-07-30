import {getColorRGBA} from 'library/colors';
import {ButtonOptionsRequired, ColorRGBA, TransitionTypes, Transitions} from 'library/types/button';

const transitions: Transitions = [];

type ColorValues = 'r' | 'g' | 'b' | 'a';

const transitionTypes: TransitionTypes[] = ['fill', 'stroke', 'textFill'];
const colorValues: ColorValues[] = ['r', 'g', 'b', 'a'];

export const getTransitions = (color: ButtonOptionsRequired['color'], steps = 10) => {
    const changes = <Record<TransitionTypes, ReturnType<typeof colorChange>>>{};

    transitionTypes.forEach(type => (changes[type] = colorChange(color[type], color.transition[type], steps)));

    // changes.push(colorChange(color.fill, color.transition.fill, steps));
    // changes.push(colorChange(color.stroke, color.transition.stroke, steps));
    // changes.push(colorChange(color.textFill, color.transition.textFill, steps));

    console.log(changes);

    const transition = {
        steps,
        on: () => {
            if (transition.steps === 0) return;

            transitionTypes.forEach(type => {
                color[type].r += changes[type].r;
                color[type].g += changes[type].g;
                color[type].b += changes[type].b;
                color[type].a += changes[type].a;
            });

            transition.steps--;
        },
        off: () => {
            if (transition.steps >= 10) return;

            transitionTypes.forEach(type => {
                color[type].r -= changes[type].r;
                color[type].g -= changes[type].g;
                color[type].b -= changes[type].b;
                color[type].a -= changes[type].a;
            });

            transition.steps++;
        },
    };

    // transitions.push(transition); // is this needed?

    return transition;
};

const colorChange = (source: ColorRGBA, target: ColorRGBA, steps: number) => {
    const minR = (target.r - source.r) / steps;
    const minG = (target.g - source.g) / steps;
    const minB = (target.b - source.b) / steps;
    const minA = (target.a - source.a) / steps;

    return {r: minR, g: minG, b: minB, a: minA};
};
