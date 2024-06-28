import {resources} from 'library/demo';
import {mouse} from 'library/input';

type ButtonOptionsRequired = Required<Omit<ButtonOptions, 'mouseup'>> & {mouseup?: (ev: MouseEvent) => void};

const getButtonProperties: (options?: ButtonOptions) => ButtonOptionsRequired = (options = {}) => ({
    type: 'fill',
    x: innerWidth / 10,
    y: innerHeight / 10,
    w: innerWidth / 6,
    h: innerHeight / 10,
    stroke: '#f00',
    fill: '#ccc',
    text: 'Default',
    textColor: '#fff',
    lw: 2,
    r: 5,
    font: '16px Arial', // make non-hardcoded
    mouseup: undefined,
    ...options,
});

// 1. make all button properties optional
// 2. onhover:  -color (fill / stroke)
//              -size (scale out/in)
//              -dropShadow
// 3. onClick:  -loadAnimation
//              -dissapear / appear effects (slide / fade)
// 4. make button object dynamic for property changes for button methods (point 2 and 3)

type ButtonOptions = {
    type?: ButtonType;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    lw?: number;
    r?: number;
    stroke?: string;
    fill?: string;
    text?: string;
    textColor?: string;
    font?: string;
    mouseup?: (ev: MouseEvent) => void;
};

let idCount = 0;

export default {
    create: (options: ButtonOptions = {}) => createButton(options),
};

export type ButtonType = 'fill' | 'stroke' | 'fillStroke';

const createButtonShow: Record<
    ButtonType,
    (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => () => void
> = {
    fill: (props, ctx) => () => {
        // button
        ctx.fillStyle = props.fill;

        ctx.beginPath();
        ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
        ctx.fill();

        // text
        ctx.fillStyle = props.textColor;
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

        ctx.fillStyle = props.textColor;
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

        ctx.fillStyle = props.textColor;
        ctx.font = props.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.beginPath();
        ctx.fillText(props.text, props.x, props.y);
    },
};

export const createButton = (options: ButtonOptions = {}) => {
    const {context: ctx} = resources.state;
    const props = getButtonProperties(options);

    const show = {
        id: idCount++, // auto-create = auto-increase
        name: 'default button', // placeholder
        fn: createButtonShow[props.type](props, ctx),
    };

    const inside = () =>
        mouse.x >= props.x - props.w / 2 &&
        mouse.x < props.x + props.w / 2 &&
        mouse.y >= props.y - props.h / 2 &&
        mouse.y < props.y + props.h / 2;

    if (props.mouseup != null) {
        const {mouseup} = props;

        addEventListener('mouseup', (ev: MouseEvent) => {
            if (inside()) mouseup(ev);
        });
    }

    const getTextProperties = () => {
        ctx.font = props.font;

        return {
            width: ctx.measureText(props.text).width,
        };
    };

    return {show, getTextProperties};
};

// const getButtonLines = (x: number, y: number, w: number, h: number) => {
//     const mTB = h / 3;
//     const mLR = w / 5;
//     const yStep = (h - mTB * 2) / 2;

//     const line1 = {x: x + mLR, y: y + mTB, x2: x + w - mLR, y2: y + mTB};
//     const line2 = {x: x + mLR, y: y + mTB + yStep, x2: x + w - mLR, y2: y + mTB + yStep};
//     const line3 = {x: x + mLR, y: y + mTB + yStep * 2, x2: x + w - mLR, y2: y + mTB + yStep * 2};

//     return [line1, line2, line3];
// };

// const menuBorder = {
//     x: 250,
//     y: 40,
//     w: 240,
//     h: 210,
//     r: 5,
// };

// const openMenu = () => {
//     // menu border (slide-in from above)
//     const {x, y, w, h, r} = menuBorder;
//     const {context: ctx} = gameStore.state;

//     const show = () => {
//         ctx.fillStyle = '555';
//         ctx.strokeStyle = '#fff';
//         ctx.lineWidth = 2;

//         ctx.beginPath();
//         ctx.roundRect(x, y, w, h, r);
//         ctx.fill();
//         ctx.stroke();
//     };

//     return show;
// };

// const startButton = {
//     txt: 'Start',
//     x: 50,
//     y: 450,
//     w: 50,
//     h: 20,
//     r: 5,
//     lw: 2,
//     stroke: '#fff',
//     fill: '#000',
//     textColor: '#00f',
//     font: '20px normal sans-serif',
// };

// export const getMenuButton = (ctx: CanvasRenderingContext2D) => {
//     const {w, h, r, lw, stroke} = menuButton;
//     let fill = 0;
//     const fillAcc = 5;
//     const fillMax = 100;
//     const fillMin = 0;
//     const x = ctx.canvas.width - 30;
//     const y = 10;

//     const lines = getButtonLines(x, y, w, h);

//     const show = () => {
//         const newFill = `rgb(${fill}, ${fill}, ${fill})`;
//         ctx.strokeStyle = stroke;
//         ctx.fillStyle = newFill;
//         ctx.lineWidth = lw;

//         ctx.beginPath();
//         ctx.roundRect(x, y, w, h, r);
//         ctx.fill();
//         ctx.stroke();

//         for (const line of lines) {
//             ctx.strokeStyle = '#fff';
//             ctx.lineWidth = 1;

//             ctx.beginPath();
//             ctx.moveTo(line.x, line.y);
//             ctx.lineTo(line.x2, line.y2);
//             ctx.stroke();
//         }
//     };

//     const update = () => {
//         if (inside() && fill < fillMax) fill += fillAcc;

//         if (!inside() && fill > fillMin) fill -= fillAcc;
//     };

//     const inside = () => mouse.x >= x && mouse.x < x + w && mouse.y >= y && mouse.y < y + h;

//     addEventListener('mouseup', ({button}) => {
//         if (button === 0 && inside()) gameStore.state.engine.setShow({id: 0, name: 'open menu', fn: openMenu()});
//     });

//     return {show, update};
// };
