/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {resources} from './store';

type Side = 'top' | 'down' | 'left' | 'right';
type SQ = {s: number; height: number; width: number};

// const clamp = (obj: {x: number, y: number}) => {
//     obj.x = Math.min(max, Math.max(-max, xValue));
//     obj.y = Math.min(max, Math.max(-max, yValue));
// }

const sideSwitch: Record<Side, (sq: SQ) => {x: number; y: number; vX: number; vY: number}> = {
    top: (sq: SQ) => ({
        x: Math.random() * sq.width,
        y: -sq.s / 2,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: Math.random() * 0.3 + 1,
    }),
    down: (sq: SQ) => ({
        x: Math.random() * sq.width,
        y: sq.height + sq.s / 2,
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

    console.log(x, y, vX, vY, s);
    console.log(innerWidth, innerHeight);

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
        blinked: 0,
    };
};

const squares: Square[] = [];
const permaSquares: Square[] = [];

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
    blinked: number;
};

export default {
    createDemoUpdate: () => {
        const {context: ctx} = resources.state;

        squares.push(createRandomSquare(ctx.canvas.width, ctx.canvas.height));

        const sqToRemoveIndexes: number[] = [];
        // let count = 0;
        // const countIncrease = 60;
        // let threshold = 60;
        addEventListener('keydown', ({code}) => {
            if (code === 'KeyN') squares.push(createRandomSquare(ctx.canvas.width, ctx.canvas.height));
        });

        const id = 10;
        const name = 'demo update';
        const fn = () => {
            // for (const sq of squares) {
            for (let i = 0; i < squares.length; i++) {
                const sq = squares[i];
                sq.x += sq.vX;
                sq.y += sq.vY;

                sq.angle += sq.angleVel;
                sq.alpha -= sq.alphaVel;

                if (sq.alpha < sq.minAlpha) {
                    sq.alpha = sq.minAlpha;
                    sq.alphaVel *= -1;
                } else if (sq.alpha > sq.maxAlpha) {
                    sq.alpha = sq.maxAlpha;
                    sq.alphaVel *= -1;
                    sq.blinked++;

                    if (sq.blinked === 2) {
                        addPermaSquare(sq);
                        sq.blinked = 3;

                        console.log(`squares length: ${squares.length}`);
                        console.log(`permaSquares length: ${permaSquares.length}`);
                    }
                }

                // collision (when outside of screen)
                // if (sq.x < -sq.s || sq.x + sq.s > ctx.canvas.width || sq.y < -sq.s || sq.y + sq.s > ctx.canvas.height) {
                //     sqToRemoveIndexes.push(i);
                //     console.log('removed square', sq.x, sq.y);
                //     console.log(innerWidth, innerHeight);
                //     console.log(sq.s);
                // }
            }

            // count++;

            // if (count > threshold) {
            //     threshold += countIncrease;
            //     squares.push(createRandomSquare(ctx.canvas.width, ctx.canvas.height));
            // }

            // remove squares out of bound of view
            for (let i = 0; i < sqToRemoveIndexes.length; i++) squares.splice(i, 1);
        };

        return {id, name, fn};
    },
    createDemoShow: () => {
        const {context: ctx} = resources.state;

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
            }

            for (const sq of permaSquares) {
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
            }
        };

        return {id, name, fn};
    },
};

const addPermaSquare = (sq: Square) => {
    const newSq = {...sq};
    newSq.vX = 0;
    newSq.vY = 0;
    permaSquares.push(newSq);
};
