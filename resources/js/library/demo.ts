/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {resources} from './store';

type Side = 'top' | 'down' | 'left' | 'right';
type SQ = {s: number; height: number; width: number};

const sideSwitch: Record<Side, (sq: SQ) => {x: number; y: number; vX: number; vY: number}> = {
    top: (sq: SQ) => ({
        x: Math.random() * sq.width,
        y: sq.s / 2,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: Math.random() * 0.3 + 1,
    }),
    down: (sq: SQ) => ({
        x: Math.random() * sq.width,
        y: -sq.s / 2,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: -(Math.random() * 0.3 + 1),
    }),
    left: (sq: SQ) => ({
        x: -sq.s / 2,
        y: Math.random() * sq.height,
        vX: Math.random() * 0.3 + 1,
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
    right: (sq: SQ) => ({
        x: sq.width + sq.s / 2,
        y: Math.random() * sq.height,
        vX: -(Math.random() * 0.3 + 1),
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
};

const createRandomSquare = (width: number, height: number) => {
    // this is optional, they may also appear on the screen itself, tho alpha needs to be set to 0 in that case
    let side: Side;
    const dice = Math.random();

    if (dice < 0.25) side = 'top';
    else if (dice < 0.5) side = 'down';
    else if (dice < 0.75) side = 'left';
    else side = 'right';

    const s = Math.random() * 15 + 15; // between 15 and 30
    const sq = {s, width, height};

    const {x, y, vX, vY} = sideSwitch[side](sq);

    return {
        x,
        y,
        vX,
        vY,
        s,
        r: 5,
        alpha: 0,
        alphaVel: Math.random() * 0.01, // 0.001 - 0.01 ?
        angle: 0,
        angleVel: Math.random() * 0.1 * (Math.random() < 0.5 ? 1 : -1), // 0.01 - 0.1 ? (or negative)
        red: Math.random() * 256,
        green: Math.random() * 256,
        blue: Math.random() * 256,
        minAlpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.5 + 0.5,
    };
};

const squares: Square[] = [];

type Square = {
    x: number;
    y: number;
    s: number;
    r: number;
    alpha: number;
    alphaVel: number;
    angle: number;
    angleVel: number;
    red: number;
    green: number;
    blue: number;
    minAlpha: number;
    maxAlpha: number;
    vX: number;
    vY: number;
};

export default {
    createDemoUpdate: () => {
        const id = 10;
        const name = 'demo update';
        const fn = () => {
            for (const sq of squares) {
                sq.x += sq.vX;
                sq.y += sq.vY;
            }
        };

        return {id, name, fn};
    },
    createDemoShow: () => {
        const {context: ctx} = resources.state;

        squares.push(createRandomSquare(ctx.canvas.width, ctx.canvas.height));

        let count = 0;

        const id = 10;
        const name = 'demo show';
        const fn = () => {
            for (const sq of squares) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(${sq.red}, ${sq.green}, ${sq.blue}, ${sq.alpha})`;

                const x = sq.x + sq.s / 2;
                const y = sq.y + sq.s / 2;

                ctx.beginPath();

                ctx.save();

                ctx.translate(x, y);
                ctx.rotate(sq.angle);
                ctx.translate(-x, -y);

                ctx.roundRect(sq.x, sq.y, sq.s, sq.s, sq.r);
                ctx.stroke();

                ctx.restore();

                sq.angle += sq.angleVel;
                sq.alpha -= sq.alphaVel;

                if (sq.alpha < sq.minAlpha) {
                    sq.alpha = sq.minAlpha;
                    sq.alphaVel *= -1;
                } else if (sq.alpha > sq.maxAlpha) {
                    sq.alpha = sq.maxAlpha;
                    sq.alphaVel *= -1;
                }
            }

            count++;
            if (count % 60 === 0) squares.push(createRandomSquare(ctx.canvas.width, ctx.canvas.height));
        };

        return {id, name, fn};
    },
};
