import {uid} from 'library/helpers';
import {Engine} from 'library/types/engine';
import {Rect} from 'library/types/tv';

const transitionTypes: TransitionTypes[] = ['fill', 'stroke', 'textFill'];
const colorValues: ColorValues[] = ['r', 'g', 'b', 'a'];

export const createTransitionUpdate = (
    props: Rect & {color: {textFill: ColorRGBA}},
    onTransitionFinished: () => void,
    steps: number = 20,
) => {
    let widthShrink = true;
    let finished = false;
    let count = 0;

    const changePerStep = {
        w: calculateSingleStep(props.w, 0, steps),
        h: calculateSingleStep(props.h, 0, steps),
    };

    const fn = () => {
        if (finished) return;

        props.color.textFill.a -= 0.01;

        if (widthShrink) {
            props.w += changePerStep.w;

            count++;

            if (count >= steps) widthShrink = false;

            return;
        }

        props.h += changePerStep.h;

        count--;

        if (count <= 0) {
            widthShrink = true;
            finished = true;

            onTransitionFinished();
        }
    };

    return {
        id: `transition ${uid()}`,
        fn,
    };
};

export const getTransitions = (color: Required<ButtonColorAndTransitionProperties>, steps = 10) => {
    const colorChangePerStep = <Record<TransitionTypes, ReturnType<typeof calculateDifferencePerStep>>>{};

    transitionTypes.forEach(
        type => (colorChangePerStep[type] = calculateDifferencePerStep(color[type], color.transition[type], steps)),
    );

    const transition = {
        steps,
        forward: () => {
            if (transition.steps <= 0) return;

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
        diffPerStep[colorValues[i]] = calculateSingleStep(source[colorValues[i]], target[colorValues[i]], steps);

    return diffPerStep;
};

const calculateSingleStep = (source: number, target: number, steps: number) => (target - source) / steps;
