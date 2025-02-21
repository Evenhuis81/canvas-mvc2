import type {Colors} from 'library/types/color';
import {EngineDraw} from 'library/types/engine';
// import type {EngineDrawConfig} from 'library/types/engine';
import type {Callbacks, EventHandler, GeneralProperties, VisualProperties} from 'library/types/entity';
import type {EntitySketchMap} from 'library/types/entitySketch';
import type {LibraryInput} from 'library/types/input';

export const createRenders = (
    props: GeneralProperties,
    sketch: EntitySketchMap['button1'],
    {startSpeed = 3, endSpeed = 3}: Partial<VisualProperties>,
    input: LibraryInput,
    context: CanvasRenderingContext2D,
    // eventHandler: EventHandler,
) => {
    const {id, name} = props;

    const draw = createDraw(context, sketch);

    const transitions = {
        fadein1: () => {
            const {update: fn, prepare, callback} = createTransitionFadein1(sketch.color, 0.005 * startSpeed);

            return {
                update: {
                    id: `${id}-fadein1`,
                    name: `transition-fadein1-${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
        fadeout1: () => {
            const {update: fn, prepare, callback} = createTransitionFadeout1(sketch.color, 0.005 * endSpeed);

            return {
                update: {
                    id: `${id}-fadeout1`,
                    name: `transition-fadeout1${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
        explode: () => {
            const {update: fn, prepare, callback} = createTransitionExplode(sketch, sketch.color);

            return {
                update: {
                    id: `${id}-slideinleft`,
                    name: `transition-slideinleft-${name}`,
                    fn,
                    callback,
                },
                prepare,
            };
        },
    };

    const animations = {
        noise: () => ({
            update: {
                id: `${id}-noise`,
                name: `animation-noise-${name}`,
                fn: createAnimationNoise(sketch),
            },
        }),
    };

    return {
        hovers,
        transitions,
        animations,
        draw,
    };
};

const createTransitionFadein1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number) => {
    const callback = () => {
        console.log('callback fadein1');
    };

    const update = () => {
        fill.a += alphaVelocity;
        stroke.a += alphaVelocity;
        textFill.a += alphaVelocity;

        if (fill.a >= 1) end();
    };

    const prepare = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;
    };

    const end = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;

        // console.log('endOfStart in fadein1');
        // callbacks.endOfStart.fn();
        callback();
    };

    return {update, prepare, end, callback};
};

const createTransitionFadeout1 = ({fill, stroke, textFill}: Colors, alphaVelocity: number) => {
    const callback = () => {
        console.log('callback fadeout1');
    };

    const update = () => {
        fill.a -= alphaVelocity;
        stroke.a -= alphaVelocity;
        textFill.a -= alphaVelocity;

        if (fill.a <= 0) end();
    };

    const prepare = () => {
        fill.a = 1;
        stroke.a = 1;
        textFill.a = 1;
    };

    const end = () => {
        fill.a = 0;
        stroke.a = 0;
        textFill.a = 0;

        // console.log('endOFEnd');
        // callbacks.endOfEnd.fn();
        callback();
    };

    return {update, prepare, end, callback};
};

let phase = 1;

const createTransitionExplode = (sketch: EntitySketchMap['button1'], {fill, stroke, textFill}: Colors) => {
    const callback = () => {
        console.log('callback explode');
    };

    const update = () => {
        if (phase === 1) sketch.lineWidth += 0.1;
        else if (phase === 2) {
            fill.a -= 0.01;
            stroke.a -= 0.01;
            textFill.a -= 0.01;

            if (fill.a < 0) {
                fill.a -= 0;
                stroke.a -= 0;
                textFill.a -= 0;

                // callbacks.endOfEnd.fn();
                callback();
            }
        }

        if (sketch.lineWidth > 10) {
            sketch.lineWidth = 10;

            phase = 2;
        }
    };

    // Figure out what this one does
    const end = () => {};

    const prepare = () => {};

    return {update, prepare, end, callback};
};

const createTransitionUpdate =
    (
        {mouse}: LibraryInput, // only mouse, no hover on touch
        sketch: EntitySketchMap['button1'],
        transition: {
            forward: () => void;
            reverse: () => void;
        },
    ) =>
    () => {
        if (mouse.inside(sketch)) {
            transition.forward();

            return;
        }

        transition.reverse();
    };
