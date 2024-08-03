import {ButtonOptionsRequired, ColorRGBA, ColorValues, TransitionTypes} from 'library/types/button';
import {Rect} from 'library/types/tv';

const transitionTypes: TransitionTypes[] = ['fill', 'stroke', 'textFill'];
const colorValues: ColorValues[] = ['r', 'g', 'b', 'a'];

export const createTransition = (rect: Rect) => {
    return () => {
        // console.log('transitioning');
    };
};

export const getTransitions = (color: ButtonOptionsRequired['color'], steps = 10) => {
    const colorChangePerStep = <Record<TransitionTypes, ReturnType<typeof calculateDifferencePerStep>>>{};

    transitionTypes.forEach(
        type => (colorChangePerStep[type] = calculateDifferencePerStep(color[type], color.transition[type], steps)),
    );

    const transition = {
        steps,
        forward: () => {
            if (transition.steps <= 0) return;

            // TODO:: Refactor
            for (let i = 0; i < transitionTypes.length; i++) {
                color[transitionTypes[i]].r += colorChangePerStep[transitionTypes[i]].r;
                color[transitionTypes[i]].g += colorChangePerStep[transitionTypes[i]].g;
                color[transitionTypes[i]].b += colorChangePerStep[transitionTypes[i]].b;
                color[transitionTypes[i]].a += colorChangePerStep[transitionTypes[i]].a;
            }

            transition.steps--;
        },
        reverse: () => {
            if (transition.steps >= 10) return;

            for (let i = 0; i < transitionTypes.length; i++) {
                color[transitionTypes[i]].r -= colorChangePerStep[transitionTypes[i]].r;
                color[transitionTypes[i]].g -= colorChangePerStep[transitionTypes[i]].g;
                color[transitionTypes[i]].b -= colorChangePerStep[transitionTypes[i]].b;
                color[transitionTypes[i]].a -= colorChangePerStep[transitionTypes[i]].a;
            }

            transition.steps++;
        },
    };

    return transition;
};

/**
 *
 * @param source Source Color Palet RGBA
 * @param target Target Color Palet RGBA
 * @param steps Number of steps to go from source to target
 * @returns differences per step for color and alpha values
 */
const calculateDifferencePerStep = (source: ColorRGBA, target: ColorRGBA, steps: number) => {
    const diffPerStep = {r: 0, g: 0, b: 0, a: 0};

    for (let i = 0; i < colorValues.length; i++)
        diffPerStep[colorValues[i]] = (target[colorValues[i]] - source[colorValues[i]]) / steps;

    return diffPerStep;
};

const calculateDifferencePerStep2 = (source: number, target: number, steps: number) => (target - source) / steps;
