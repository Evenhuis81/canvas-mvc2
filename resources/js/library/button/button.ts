import type {Button, ButtonOptions, ButtonOptionsRequired} from 'library/types/button';
import {resources} from '..';
import {getColorRGBA} from 'library/colors';
import {getTransitions} from './transition';
import {Resources} from 'library/types';

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

const getButtonProperties: (options: ButtonOptions) => ButtonOptionsRequired = options => ({
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
    font: '16px monospace',
    pushed: false,
    destructed: false,
    ...options,
});

const findAndDestroy = (id: string | number) => {
    const index = buttons.findIndex(button => button.id === id);

    if (id === -1) return;

    buttons[index].selfDestruct();

    buttons.splice(index, 1);
};

type HoverTransition = {
    steps: number;
    forward: () => void;
    reverse: () => void;
};

type ButtonEvent = {
    type: string;
    handler: () => void;
};

const setEvents = (events: ButtonEvent[]) => {};

export const createButton = (resourceID: string, options: ButtonOptions) => {
    const {context, engine, input} = resources[resourceID];
    const props = getButtonProperties(options);
    const hoverTransition = getTransitions(props.color);

    const update = createButtonUpdate(props, input, hoverTransition);
    const show = createButtonShow(props, context);

    const events = getEvents(props, input);

    setEvents(events);

    const selfDestruct = () => {
        if (props.destructed) throw new Error(`Button ${props.id} is already destroyed!`);

        // use events and loop (array with eventtypes and handlers)
        // removeEventListener('touchstart', touchstartEvent);
        // removeEventListener('touchend', touchendEvent);
        // removeEventListener('mouseup', mouseupEvent);
        // removeEventListener('mousedown', mousedownEvent);

        props.destructed = true;
    };

    engine.setShow(show);
    engine.setUpdate(update);

    buttons.push({id: props.id, selfDestruct});
};

const createButtonUpdate = (
    props: ButtonOptionsRequired,
    {mouse}: Resources['input'],
    transition: HoverTransition,
) => ({
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

const createButtonShow = (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => ({
    id: props.id,
    name: props.name,
    fn: () => () => {
        const {fill, stroke, textFill} = props.color;

        ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;
        ctx.strokeStyle = `rgba(${stroke.r}, ${stroke.g}, ${stroke.b}, ${stroke.a})`;
        ctx.lineWidth = props.lw;

        ctx.beginPath();
        ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(${textFill.r}, ${textFill.g}, ${textFill.b}, 1)`;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
});

const getEvents = (props: ButtonOptionsRequired, input: Resources['input']) => {
    const {click} = props;
    const {mouse, touch} = input;

    const selfDestruct = () => {};

    const mousedownEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0) {
            if (click?.down) click.down({evt, button: {id: props.id, selfDestruct}});
            // Default transition (as example and to test functionality)
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const mouseupEvent = (evt: MouseEvent) => {
        if (mouse.insideRect(props) && evt.button === 0 && click?.up)
            click.up({evt, button: {id: props.id, selfDestruct}});

        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;
        }
    };

    const touchstartEvent = () => {
        if (touch.insideRect(props)) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const touchendEvent = () => {
        // if (touch.insideRect(props) && click?.up) click.up({evt, button: {id: props.id, selfDestruct}});

        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;
        }
    };

    return [
        {type: 'touchstart', handler: touchstartEvent},
        {type: 'touchstart', handler: touchstartEvent},
        {type: 'touchend', handler: touchendEvent},
        {type: 'mouseup', handler: mouseupEvent},
        {type: 'mousedown', handler: mousedownEvent},
    ];
};

// if (mouseupEvent && touchendEvent) {
//     removeEventListener('touchend', touchendEvent);
//     removeEventListener('mouseup', mouseupEvent);
// }

// let mouseupEvent: ((event: MouseEvent) => void) | undefined;
// let touchendEvent: ((event: TouchEvent) => void) | undefined;

// mouseupEvent = (evt: MouseEvent) => {
//     if (mouse.insideRect(props) && evt.button === 0) click({evt, button: {selfDestruct}});
// };

// touchendEvent = (evt: TouchEvent) => {
//     if (touch.insideRect(props)) click({evt, button: {id: props.id, selfDestruct}});
// };
