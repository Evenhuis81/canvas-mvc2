import type {Button, ButtonOptions, ButtonOptionsRequired, ButtonType, ColorRGBA} from 'library/types/button';
import {resources} from '..';
import {getColorRGBA} from 'library/colors';
import {getHoverProperties} from './hover';

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
};

const getButtonProperties: (options: ButtonOptions) => ButtonOptionsRequired = options => ({
    id: 'noID',
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
        textStroke: getColorRGBA(255, 255, 255, 1),
        hover: {
            fill: getColorRGBA(100, 100, 100, 1),
            stroke: getColorRGBA(155, 0, 0, 1),
            textFill: getColorRGBA(0, 255, 0, 1),
            textStroke: getColorRGBA(255, 0, 0, 1),
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

export const createButton = (resourceID: string, options: ButtonOptions) => {
    const {
        context: ctx,
        engine,
        input: {mouse, touch},
    } = resources[resourceID];
    const props = getButtonProperties(options);
    const hover = getHoverProperties(props.color);

    const show = {
        id: props.id,
        name: props.name,
        // fn: createButtonShow[props.type](props, ctx),
        fn: () => {},
    };

    const colorRGBAMin = (source: ColorRGBA, target: ColorRGBA, steps: number = 10) => {
        const minR = (target.r - source.r) / steps;
        const minG = (target.g - source.g) / steps;
        const minB = (target.b - source.b) / steps;
        const minA = (target.a - source.a) / steps;

        return {r: minR, g: minG, b: minB, a: minA};
    };

    const update = {
        id: props.id,
        name: props.name,
        fn: () => {
            if (mouse.insideRect(props) && !mouse.touchEnded) {
                // hover(props);

                return;
            }

            // hoverOff(hoverProperties, props);
        },
    };

    let mouseupEvent: ((event: MouseEvent) => void) | undefined;
    let touchendEvent: ((event: TouchEvent) => void) | undefined;

    if (props.click) {
        const {click} = props;

        mouseupEvent = (evt: MouseEvent) => {
            if (mouse.insideRect(props) && evt.button === 0)
                click({evt, button: {id: props.id, update, show, selfDestruct}});
        };

        touchendEvent = (evt: TouchEvent) => {
            if (touch.insideRect(props)) click({evt, button: {id: props.id, update, show, selfDestruct}});
        };

        addEventListener('mouseup', mouseupEvent);
        addEventListener('touchend', touchendEvent);
    }

    const internalMousedownEvent = ({button}: MouseEvent) => {
        if (mouse.insideRect(props) && button === 0) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const internalMouseupEvent = () => {
        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;
        }
    };

    const internalTouchstartEvent = () => {
        if (touch.insideRect(props)) {
            props.pushed = true;
            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const internalTouchendEvent = () => {
        if (props.pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            props.pushed = false;
        }
    };

    addEventListener('touchstart', internalTouchstartEvent);
    addEventListener('touchend', internalTouchendEvent);
    addEventListener('mouseup', internalMouseupEvent);
    addEventListener('mousedown', internalMousedownEvent);

    const selfDestruct = () => {
        if (props.destructed) {
            console.log(`Button ${props.id} is already destroyed!`);
        }

        removeEventListener('touchstart', internalTouchstartEvent);
        removeEventListener('touchend', internalTouchendEvent);
        removeEventListener('mouseup', internalMouseupEvent);
        removeEventListener('mousedown', internalMousedownEvent);

        if (mouseupEvent && touchendEvent) {
            removeEventListener('touchend', touchendEvent);
            removeEventListener('mouseup', mouseupEvent);
        }

        engine.removeUpdate(props.id);
        engine.removeShow(props.id);

        props.destructed = true;
    };

    engine.setShow(show);
    engine.setUpdate(update);

    buttons.push({id: props.id, update, show, selfDestruct});
};

// const show = (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => () => {
//     ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//     ctx.strokeStyle = props.stroke;
//     ctx.lineWidth = props.lw;

//     ctx.beginPath();
//     ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
//     ctx.fill();
//     ctx.stroke();

//     ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//     ctx.font = props.font;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';

//     ctx.beginPath();
//     ctx.fillText(props.text, props.x, props.y);
// };

// const createButtonShow: Record<
//     ButtonType,
//     (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => () => void
// > = {
//     fill: (props, ctx) => () => {
//         // button
//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.fill();

//         // text
//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     stroke: (props, ctx) => () => {
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     fillStroke: (props, ctx) => () => {
//         ctx.fillStyle = props.fill;
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.fill();
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     fillStrokeRound: (props, ctx) => () => {
//         ctx.fillStyle = props.fill;
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
//         ctx.fill();
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
// };
