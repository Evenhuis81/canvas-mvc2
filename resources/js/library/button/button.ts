import type {Button, ButtonOptions, InternalButtonOptions} from 'library/types/button';
import {resources} from '..';
import {getColorRGBA} from 'library/colors';
import {getTransitions} from './transition';
import {Resources} from 'library/types';
import {Engine, Update} from 'library/types/engine';

const buttons: Button[] = [];
let autoID = 0;

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
};

const getButtonProperties: (options: ButtonOptions) => InternalButtonOptions = options => ({
    id: options.id ? 'noID' : autoID++,
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

const findAndDestroy = (id: string | number) => {
    const index = buttons.findIndex(button => button.id === id);

    if (id === -1) return;

    buttons[index].selfDestruct();

    buttons.splice(index, 1);
};

type Transition = {
    steps: number;
    forward: () => void;
    reverse: () => void;
};

const setColorForDisableAndActivate = (color: InternalButtonOptions['color'], alpha: number) => {
    color.fill.a = alpha;
    color.stroke.a = alpha;
    color.textFill.a = alpha;
};

const dim = (props: InternalButtonOptions) => setColorForDisableAndActivate(props.color, 0.5);
const brighten = (props: InternalButtonOptions) => setColorForDisableAndActivate(props.color, 1);

export const createButton = (resourceID: string, options: ButtonOptions) => {
    // create default hoverTransition and endTransition and give it a (if disabled) option

    // TODO:: Add fontsize to internal button options

    const {context, engine, input} = resources[resourceID];
    const props = getButtonProperties(options);
    const hoverTransition = getTransitions(props.color);

    const update = createButtonUpdate(props, input, hoverTransition);
    const show = createButtonShow(props, context);

    const {selfDestruct, activate, disable} = handleEvents(props, input, engine, update);

    engine.setUpdate(update);
    engine.setShow(show);

    // This selfDestruct won't remove the endtransition update if active or is it?
    buttons.push({id: props.id, selfDestruct, disable, activate});
};

// This is optional, for now it's a default on the button, but there should be themes and variety here
const createButtonUpdate = (props: InternalButtonOptions, {mouse}: Resources['input'], transition: Transition) => ({
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

const createButtonShow = (props: InternalButtonOptions, ctx: CanvasRenderingContext2D) => ({
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
        ctx.fillText(props.text, props.x, props.y);
    },
});

const createEndTransitionUpdate = (props: InternalButtonOptions, engine: Engine, selfDestruct: () => void) => {
    let count = 0;

    const reactivate = () => {
        props.color.stroke.a = 1;
        props.color.fill.a = 1;
        props.color.textFill.a = 1;
    };

    const update = {
        id: `end transition.${props.id}`,
        fn: () => {
            if (count > 120 && props.click?.end) {
                engine.removeUpdate(update.id);

                props.color.stroke.a = 0.5;
                props.color.fill.a = 0.5;
                props.color.textFill.a = 0.5;

                props.click.end({
                    id: update.id,
                    selfDestruct,
                    reactivate, // make this generic evt that works for several click methods
                });
            }

            count++;
        },
    };

    return update;
};

const handleEvents = (props: InternalButtonOptions, input: Resources['input'], engine: Engine, update: Update) => {
    const {click, id} = props;
    const {mouse, touch} = input;

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

    const endTransitionUpdate = createEndTransitionUpdate(props, engine, selfDestruct);

    const mousedownEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0) {
            if (click?.down) click.down({evt, button: {id, selfDestruct, activate, disable}});

            // Default transition (as example and to test functionality)
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const mouseTouchUp = () => {
        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;

            // Transition event from clickup until the transition is finished
            engine.setUpdate(endTransitionUpdate);

            console.log('end transition update set');
        }
    };

    const mouseupEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0 && click?.up) click.up({id, selfDestruct, activate, disable});

        mouseTouchUp();
    };

    const touchstartEvent = () => {
        if (touch.insideRect(props)) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const touchendEvent = () => {
        if (touch.insideRect(props) && click?.up) click.up({id, selfDestruct, activate, disable});

        mouseTouchUp();
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

    return {selfDestruct, activate, disable};
};
