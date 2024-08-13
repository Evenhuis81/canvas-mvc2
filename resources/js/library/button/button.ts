import {resources} from '..';
import {getTransitions} from './transition';
import {getButtonProperties} from './properties';
import type {Resources} from 'library/types';
import type {Engine, Update} from 'library/types/engine';

const buttons: Button[] = [];

export const createButton = (resourceID: string, options: ButtonOptions) => {
    const {context, engine, input} = resources[resourceID];

    const {props, handlers, colors} = getButtonProperties(options);

    // simplify
    const hoverTransition = getTransitions(colors);

    const update = createButtonUpdate(props, input, hoverTransition);
    const show = createButtonShow(props, colors, context);

    // simplify
    const {selfDestruct, activate, disable, setEndTransition} = handleEventsAndMore(
        props,
        colors,
        handlers,
        input,
        engine,
        update,
    );

    engine.setUpdate(update);
    engine.setShow(show);

    buttons.push({id: props.id, selfDestruct, disable, activate, setEndTransition});
};

// This is optional, for now it's a default on the button, but there should be themes and variety here
const createButtonUpdate = (props: InternalButtonProperties, {mouse}: Resources['input'], transition: Transition) => ({
    id: props.id,
    name: props.name,
    fn: () => {
        if (mouse.insideRect(props) && !mouse.touchEnded) {
            transition.forward();

            return;
        }

        transition.reverse();
    },
});

const createButtonShow = (
    props: InternalButtonProperties,
    colors: ButtonColorAndTransitionProperties,
    ctx: CanvasRenderingContext2D,
) => ({
    id: props.id,
    name: props.name,
    fn: () => {
        const {fill, stroke, textFill} = colors;

        ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
        ctx.lineWidth = props.lw;

        ctx.beginPath();
        ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, ${textFill.a})`;
        ctx.font = `${props.fontSize}px ${props.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y + 1.5); // use textAscend / -descent
    },
});

const setColorForDisableAndActivate = (color: ButtonColorAndTransitionProperties, alpha: number) => {
    color.fill.a = alpha;
    color.stroke.a = alpha;
    color.textFill.a = alpha;
};

const dim = (colors: ButtonColorAndTransitionProperties) => setColorForDisableAndActivate(colors, 0.5);
const brighten = (colors: ButtonColorAndTransitionProperties) => setColorForDisableAndActivate(colors, 1);

const createEndTransitionUpdate = (
    props: InternalButtonProperties,
    colors: ButtonColorAndTransitionProperties,
    engine: Engine,
    onFinished: () => void,
    steps = 30,
) => {
    const widthStep = props.w / steps;
    const heightStep = props.h / steps;
    const textFadeStep = 1 / steps;

    const update = {
        id: `end transition.${props.id}`,
        fn: () => {
            props.w -= widthStep;
            props.h -= heightStep;
            colors.textFill.a -= textFadeStep;

            if (props.w <= 0) {
                engine.removeUpdate(update.id); // abstract this?

                onFinished();
            }
        },
    };

    return update;
};

// Namechange and possibly undeniably a seperate of concerns
const handleEventsAndMore = (
    props: InternalButtonProperties,
    colors: ButtonColorAndTransitionProperties,
    handlers: ButtonHandlers,
    input: Resources['input'],
    engine: Engine,
    update: Update,
) => {
    const {id} = props;
    const {mouse, touch} = input;

    console.log(handlers);

    const setEndTransition = (destruct = false) => {
        props.destruct = destruct;

        engine.setUpdate(endTransitionUpdate);
    };

    const selfDestruct = () => {
        if (props.destructed) throw new Error(`Button ${id} is already destroyed!`);

        removeEvents();

        engine.removeUpdate(id);
        engine.removeShow(id);

        props.destructed = true;
    };

    const disable = () => {
        engine.removeUpdate(id);

        dim(colors);
    };

    const activate = () => {
        engine.setUpdate(update);

        brighten(colors);
    };

    const onFinished = () => {
        handlers.end(button);

        if (props.destruct) selfDestruct();
    };

    const endTransitionUpdate = createEndTransitionUpdate(props, colors, engine, onFinished);

    const mousedownEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;

            handlers.down({evt, button});
        }
    };

    const mouseTouchUp = () => {
        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;
        }
    };

    const mouseupEvent = (evt: MouseEvent) => {
        mouseTouchUp();

        if (mouse.insideRect(props) && evt.button === 0) {
            handlers.up({evt, button});
            // setEndTransition?
        }
    };

    const touchstartEvent = (evt: TouchEvent) => {
        if (touch.insideRect(props)) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;

            handlers.down({evt, button});
        }
    };

    const touchendEvent = (evt: TouchEvent) => {
        mouseTouchUp();

        if (touch.insideRect(props)) handlers.up({evt, button});
    };

    const button = {
        id: props.id,
        selfDestruct,
        activate,
        disable,
        setEndTransition,
    };

    addEventListener('touchstart', touchstartEvent);
    addEventListener('touchend', touchendEvent);
    addEventListener('mouseup', mouseupEvent);
    addEventListener('mousedown', mousedownEvent);

    const removeEvents = () => {
        removeEventListener('touchstart', touchstartEvent);
        removeEventListener('touchend', touchendEvent);
        removeEventListener('mouseup', mouseupEvent);
        removeEventListener('mousedown', mousedownEvent);
    };

    return button;
};

export default {
    create: (resourceID: string, options: ButtonOptions = {}) => createButton(resourceID, options),
    destruct: (id: (string | number) | (string | string[])) => {
        if (Array.isArray(id)) {
            id.forEach(i => findAndDestroy(i));

            return;
        }

        findAndDestroy(id);
    },
    destructAll: () => {
        buttons.forEach(button => button.selfDestruct());

        buttons.length = 0;
    },
    // Namechange
    endAll: (selfID?: string | number) => {
        for (let i = 0; i < buttons.length; i++) {
            if (selfID && selfID === buttons[i].id) continue;

            const timer = i * 100 + 100;

            // TODO::Let this run on the deltatime of the engine
            setTimeout(() => {
                buttons[i].setEndTransition(true);
            }, timer);
        }
    },
};

const findAndDestroy = (id: string | number) => {
    const index = buttons.findIndex(button => button.id === id);

    if (id === -1) return;

    buttons[index].selfDestruct();

    buttons.splice(index, 1);
};
