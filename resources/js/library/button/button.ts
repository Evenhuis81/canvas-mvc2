import {resources} from '..';
import {getTransitions} from './transition';
import {Resources} from 'library/types';
import {Engine, Update} from 'library/types/engine';
import {getButtonProperties} from './properties';

const buttons: Button[] = [];

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
    // also requires a namechange
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

export const createButton = (resourceID: string, options: ButtonOptions) => {
    const {context, engine, input} = resources[resourceID];
    const props = getButtonProperties(options);
    const hoverTransition = getTransitions(props.color);

    const update = createButtonUpdate(props, input, hoverTransition);
    const show = createButtonShow(props, context);

    const {selfDestruct, activate, disable, setEndTransition} = handleEventsAndMore(props, input, engine, update);

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

const createButtonShow = (props: InternalButtonProperties, ctx: CanvasRenderingContext2D) => ({
    id: props.id,
    name: props.name,
    fn: () => {
        const {fill, stroke, textFill} = props.color;

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

const setColorForDisableAndActivate = (color: InternalButtonProperties['color'], alpha: number) => {
    color.fill.a = alpha;
    color.stroke.a = alpha;
    color.textFill.a = alpha;
};

const dim = (props: InternalButtonProperties) => setColorForDisableAndActivate(props.color, 0.5);
const brighten = (props: InternalButtonProperties) => setColorForDisableAndActivate(props.color, 1);

const createEndTransitionUpdate = (
    props: InternalButtonProperties,
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
            props.color.textFill.a -= textFadeStep;

            if (props.w <= 0) {
                engine.removeUpdate(update.id); // abstract this?

                onFinished();
            }
        },
    };

    return update;
};

// This requires a namechange and possibly undeniably a seperate of concerns
const handleEventsAndMore = (
    props: InternalButtonProperties,
    input: Resources['input'],
    engine: Engine,
    update: Update,
) => {
    const {click, id} = props;
    const {mouse, touch} = input;

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

        dim(props);
    };

    const activate = () => {
        engine.setUpdate(update);

        brighten(props);
    };

    const onFinished = () => {
        if (props.click?.end) props.click.end(button);

        if (props.destruct) selfDestruct();
    };

    const endTransitionUpdate = createEndTransitionUpdate(props, engine, onFinished);

    const mousedownEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;

            if (click?.down) click.down({evt, button});
        }
    };

    const mouseTouchUp = () => {
        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;

            setEndTransition();
        }
    };

    const mouseupEvent = (evt: MouseEvent) => {
        mouseTouchUp();

        if (mouse.insideRect(props) && evt.button === 0 && click?.up) click.up({evt, button});
    };

    const touchstartEvent = (evt: TouchEvent) => {
        if (touch.insideRect(props)) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;

            if (click?.down) click.down({evt, button});
        }
    };

    const touchendEvent = (evt: TouchEvent) => {
        mouseTouchUp();

        if (touch.insideRect(props) && click?.up) click.up({evt, button});
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

    return {selfDestruct, activate, disable, setEndTransition};
};
