/* eslint-disable max-lines-per-function */
import {resources} from './store';

const createRandomSquare = (width: number, height: number) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    s: Math.random() * 15 + 15, // between 15 and 30
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
    vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
});

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
