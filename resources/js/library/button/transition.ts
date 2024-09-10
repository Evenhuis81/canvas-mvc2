import {uid} from 'library/helpers';
import {Engine} from 'library/types/engine';
import {Rect} from 'library/types/views';

interface Transitions {
    hover: boolean;
    hoverTransition: string;
    start: boolean;
    startTransition: string;
    end: boolean;
    endTransition: string;
}

type TransitioExt = {
    steps: number;
    on: (id: string) => void;
    off: (id: string) => void;
}[];

type Transition = {
    steps: number;
    forward: () => void;
    reverse: () => void;
};

type TransitionTypes = 'fill' | 'stroke' | 'textFill';

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

export const getTransitions = (color: Required<ButtonColorAndTransitionProperties>, steps = 12) => {
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

export const createEndTransitionUpdate = (
    props: InternalButtonProperties,
    colors: InternalButtonColorAndTransitionProperties,
    engine: Engine,
    onFinished: () => void,
    steps = 30,
) => {
    const widthStep = props.w / steps;
    const heightStep = props.h / steps;
    const textAndStrokeAndFillFadeStep = 1 / steps;
    const fontSizeStep = props.fontSize / steps;
    const lwStep = props.lw / steps;

    const endTransitionUpdate = {
        id: `end transition.${uid()}`,
        fn: () => {
            props.w -= widthStep;
            props.h -= heightStep;
            props.fontSize -= fontSizeStep;
            colors.textFill.a -= textAndStrokeAndFillFadeStep;
            colors.fill.a -= textAndStrokeAndFillFadeStep;
            colors.stroke.a -= textAndStrokeAndFillFadeStep;
            props.lw -= lwStep;

            if (props.w <= 0) {
                engine.removeUpdate(endTransitionUpdate.id); // abstract this?

                onFinished();
            }
        },
    };

    return endTransitionUpdate;
};

export const createStartTransitionUpdate2 = (
    props: InternalButtonProperties,
    colors: InternalButtonColorAndTransitionProperties,
    engine: Engine,
    steps = 30,
) => {
    const originalCopy = {w: props.w, h: props.h, lw: props.lw};
    const widthStep = props.w / steps;
    const heightStep = props.h / steps;
    const textAndStrokeFadeStep = 1 / steps;
    const fontSizeStep = props.fontSize / steps;
    const lwStep = props.lw / steps;

    props.w = 0;
    props.h = 0;
    props.lw = 0;
    colors.textFill.a = 0;
    colors.stroke.a = 0;
    props.fontSize = 0;

    const startTransitionUpdate = {
        id: `start transition.${uid()}`,
        fn: () => {
            props.w += widthStep;
            props.h += heightStep;
            props.fontSize += fontSizeStep;
            colors.textFill.a += textAndStrokeFadeStep;
            colors.stroke.a += textAndStrokeFadeStep;
            props.lw += lwStep;

            // Think of a better end trigger
            if (props.w >= originalCopy.w) engine.removeUpdate(startTransitionUpdate.id);
        },
    };

    return startTransitionUpdate;
};

export const createStartTransitionUpdate = (props: InternalButtonProperties, engine: Engine, steps = 30) => {
    const originalPosX = props.x;
    const xLeftOutside = -props.w / 2 - props.lw / 2;
    const fadeInFromLeftDistance = props.x - xLeftOutside;
    const velocityXPerStep = fadeInFromLeftDistance / steps;
    props.x = xLeftOutside;

    const startTransitionUpdate = {
        id: `start transition ${props.id}`,
        fn: () => {
            props.x += velocityXPerStep;

            if (props.x >= originalPosX) {
                props.x = originalPosX;

                engine.removeUpdate(startTransitionUpdate.id);
            }
        },
    };

    return startTransitionUpdate;
};

export const createDualViewTransitionUpdate = (
    source: {width: number},
    target: {width: number},
    source2: {width: number},
    target2: {width: number},
    onFinished: (finished: boolean) => void,
    steps = 60,
) => {
    const widthPerStep = calculateSingleStep(source.width, target.width, steps);

    let accumulatedWidth = source.width;
    const upwards = source.width < target.width;

    return {
        id: 'dualview-transition',
        name: 'DualView transition update',
        fn: () => {
            accumulatedWidth += widthPerStep;

            source.width = accumulatedWidth;
            source2.width = target.width + target2.width - source.width;

            if (upwards && source.width >= target.width) {
                source.width = target.width;
                source2.width = target2.width;

                onFinished(true);
            } else if (!upwards && source.width <= target.width) {
                source.width = target.width;
                source2.width = target2.width;

                onFinished(true);
            }
        },
    };
};
