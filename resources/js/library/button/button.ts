import type {Button, ButtonEvent, ButtonOptions, ButtonOptionsRequired, ButtonType} from 'library/types/button';
import {Engine} from 'library/types/engine';
import {Input} from 'library/types/input';

export default {
    create: (context: CanvasRenderingContext2D, engine: Engine, input: Input, options: ButtonOptions = {}) =>
        createButton(context, engine, input, options),
    destruct: (id: (string | number) | (string | string[])) => {
        if (Array.isArray(id)) {
            id.forEach(i => {
                findAndDestroy(i);
            });

            return;
        }

        findAndDestroy(id);
    },
    destructAll: () => {
        buttons.forEach(button => {
            button.selfDestruct();
        });

        buttons.length = 0;
    },
};

const getButtonProperties: (options: ButtonOptions) => ButtonOptionsRequired = options => ({
    id: 'noID',
    name: 'noName',
    type: 'fillStrokeRound',
    x: innerWidth * 0.1,
    y: innerHeight * 0.1,
    w: innerWidth * 0.6,
    h: innerHeight * 0.1,
    stroke: '#f00',
    fill: '#000',
    text: 'Default',
    textFill: '#fff',
    hoverFill: '#222',
    lw: 2,
    r: 5,
    font: '16px monospace',
    ...options,
});

const buttons: Button[] = [];

const findAndDestroy = (id: string | number) => {
    const index = buttons.findIndex(button => button.id === id);

    if (id === -1) return;

    buttons[index].selfDestruct();

    buttons.splice(index, 1);
};

export const createButton = (ctx: CanvasRenderingContext2D, engine: Engine, {mouse}: Input, options: ButtonOptions) => {
    const props = getButtonProperties(options);
    let pushed = false;
    let destructed = false;

    const origFill = props.fill;

    const show = {
        id: props.id,
        name: props.name,
        fn: createButtonShow[props.type](props, ctx),
    };

    const update = {
        id: props.id,
        name: props.name,
        fn: () => {
            if (inside()) {
                props.fill = props.hoverFill;

                return;
            }

            props.fill = origFill;
        },
    };

    const inside = () =>
        mouse.x >= props.x - props.w / 2 &&
        mouse.x < props.x + props.w / 2 &&
        mouse.y >= props.y - props.h / 2 &&
        mouse.y < props.y + props.h / 2;

    type ButtonMouseupEvent = ((event: ButtonEvent) => void) | undefined;

    let mouseupEvent: ((event: MouseEvent) => void) | undefined;

    if (props.mouseup) {
        const {mouseup} = props;

        mouseupEvent = (evt: MouseEvent) => {
            if (inside() && evt.button === 0) mouseup({evt, button: {id: props.id, update, show, selfDestruct}});
        };

        addEventListener('mouseup', mouseupEvent);
    }

    const internalMousedownEvent = ({button}: MouseEvent) => {
        if (inside() && button === 0) {
            pushed = true;

            props.w *= 0.9;
            props.h *= 0.9;
        }
    };

    const internalMouseupEvent = () => {
        if (pushed) {
            props.w *= 1.1;
            props.h *= 1.1;

            pushed = false;
        }
    };

    addEventListener('mouseup', internalMouseupEvent);
    addEventListener('mousedown', internalMousedownEvent);

    const selfDestruct = () => {
        if (destructed) {
            console.log(`Button ${props.id} is already destroyed!`);
        }

        removeEventListener('mouseup', internalMouseupEvent);
        removeEventListener('mousedown', internalMousedownEvent);
        if (mouseupEvent) removeEventListener('mouseup', mouseupEvent);

        engine.removeUpdate(props.id);
        engine.removeShow(props.id);

        destructed = true;
    };

    engine.setShow(show);
    engine.setUpdate(update);

    buttons.push({id: props.id, update, show, selfDestruct});
};

const createButtonShow: Record<
    ButtonType,
    (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => () => void
> = {
    fill: (props, ctx) => () => {
        // button
        ctx.beginPath();
        ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
        ctx.fill();

        // text
        ctx.fillStyle = props.textFill;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
    stroke: (props, ctx) => () => {
        ctx.strokeStyle = props.stroke;
        ctx.lineWidth = props.lw;

        ctx.beginPath();
        ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
        ctx.stroke();

        ctx.fillStyle = props.textFill;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
    fillStroke: (props, ctx) => () => {
        ctx.fillStyle = props.fill;
        ctx.strokeStyle = props.stroke;
        ctx.lineWidth = props.lw;

        ctx.beginPath();
        ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = props.textFill;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
    fillStrokeRound: (props, ctx) => () => {
        ctx.fillStyle = props.fill;
        ctx.strokeStyle = props.stroke;
        ctx.lineWidth = props.lw;

        ctx.beginPath();
        ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = props.textFill;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
};
