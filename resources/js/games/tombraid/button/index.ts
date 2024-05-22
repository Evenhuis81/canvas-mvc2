/* eslint-disable max-lines-per-function */
// import {RoundRectFillStrokeObj} from './types/tv';

import {gameStore} from '../store';
import {mouse} from '../input';

// export const getDefaultButton = (ctx: CanvasRenderingContext2D) => {
//     const show = () => {
//         const {txt, x, y, w, h, r, lw, strokeColor, fillColor, textColor, font} = defaultButton;
//         // make 2 seperate non-tv functions for rendering rects (round/fill/stroke) and text (text-project)

//         // button
//         ctx.fillStyle = fillColor;
//         ctx.strokeStyle = strokeColor;
//         ctx.lineWidth = lw;

//         ctx.beginPath();
//         ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
//         ctx.fill();
//         ctx.stroke();

//         // text
//         ctx.fillStyle = textColor;
//         ctx.font = font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.fillText(txt, x, y);
//     };

//     return {show};
// };

const menuButton = {
    w: 20,
    h: 20,
    r: 5,
    lw: 2,
    stroke: '#fff',
    // fill: '',
};

const getButtonLines = (x: number, y: number, w: number, h: number) => {
    const mTB = h / 3;
    const mLR = w / 5;
    const yStep = (h - mTB * 2) / 2;

    const line1 = {x: x + mLR, y: y + mTB, x2: x + w - mLR, y2: y + mTB};
    const line2 = {x: x + mLR, y: y + mTB + yStep, x2: x + w - mLR, y2: y + mTB + yStep};
    const line3 = {x: x + mLR, y: y + mTB + yStep * 2, x2: x + w - mLR, y2: y + mTB + yStep * 2};

    return [line1, line2, line3];
};

const menuBorder = {
    x: 250,
    y: 40,
    w: 240,
    h: 210,
    r: 5,
};

const openMenu = () => {
    // menu border (slide-in from above)
    const {x, y, w, h, r} = menuBorder;
    const {context: ctx} = gameStore.state;

    const show = () => {
        ctx.fillStyle = '555';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.stroke();
    };

    return show;
};

const startButton = {
    txt: 'Start',
    x: 50,
    y: 450,
    w: 50,
    h: 20,
    r: 5,
    lw: 2,
    stroke: '#fff',
    fill: '#000',
    textColor: '#00f',
    font: '20px normal sans-serif',
};

export const getStartButton = (ctx: CanvasRenderingContext2D) => {
    const {txt, x, y, w, h, r, lw, stroke, fill, textColor, font} = startButton;

    const show = {
        id: 2,
        name: 'start button',
        fn: () => {
            // make 2 seperate non-tv functions for rendering rects (round/fill/stroke) and text (text-project)

            // button
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lw;

            ctx.beginPath();
            ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
            ctx.fill();
            ctx.stroke();

            // text
            ctx.fillStyle = textColor;
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(txt, x, y);
        },
    };

    const inside = () => mouse.x >= x - w / 2 && mouse.x < x + w / 2 && mouse.y >= y - h / 2 && mouse.y < y + h / 2;

    return {show, inside};
};

export const getMenuButton = (ctx: CanvasRenderingContext2D) => {
    const {w, h, r, lw, stroke} = menuButton;
    let fill = 0;
    const fillAcc = 5;
    const fillMax = 100;
    const fillMin = 0;
    const x = ctx.canvas.width - 30;
    const y = 10;

    const lines = getButtonLines(x, y, w, h);

    const show = () => {
        const newFill = `rgb(${fill}, ${fill}, ${fill})`;
        ctx.strokeStyle = stroke;
        ctx.fillStyle = newFill;
        ctx.lineWidth = lw;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.stroke();

        for (const line of lines) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        }
    };

    const update = () => {
        if (inside() && fill < fillMax) fill += fillAcc;

        if (!inside() && fill > fillMin) fill -= fillAcc;
    };

    const inside = () => mouse.x >= x && mouse.x < x + w && mouse.y >= y && mouse.y < y + h;

    addEventListener('mouseup', ({button}) => {
        if (button === 0 && inside()) gameStore.state.engine.setShow({id: 0, name: 'open menu', fn: openMenu()});
    });

    return {show, update};
};
