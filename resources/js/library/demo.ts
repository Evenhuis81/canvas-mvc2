/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {Vector} from './types/vector';
import {resources} from './store';
import {vector} from './vector';

type Side = 'top' | 'bottom' | 'left' | 'right';
type SQ = {s: number; height: number; width: number};

// unused for now, move to toolbox (= limit on vector)
export const clamp = (obj: {value: number; min: number; max: number}) =>
    Math.min(obj.max, Math.max(obj.min, obj.value));

const sideSwitch: Record<Side, (sq: SQ) => {x: number; y: number; vX: number; vY: number}> = {
    top: (sq: SQ) => ({
        x: Math.random() * (sq.width * 0.6) + sq.width * 0.2,
        y: -sq.s,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: Math.random() * 0.3 + 1,
    }),
    bottom: (sq: SQ) => ({
        x: Math.random() * (sq.width * 0.6) + sq.width * 0.2,
        y: sq.height,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: -(Math.random() * 0.3 + 1),
    }),
    left: (sq: SQ) => ({
        x: -sq.s,
        y: Math.random() * (sq.height * 0.6) + sq.height * 0.2,
        vX: Math.random() * 0.3 + 1,
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
    right: (sq: SQ) => ({
        x: sq.width,
        y: Math.random() * (sq.height * 0.6) + sq.height * 0.2,
        vX: -(Math.random() * 0.3 + 1),
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
};

const randomSide = () => {
    const dice = Math.random();

    if (dice < 0.25) return 'top';
    if (dice < 0.5) return 'bottom';
    if (dice < 0.75) return 'left';

    return 'right';
};

let id = 0;

const createSquare = (width: number, height: number, side?: Side) => {
    // TODO::Appear randomly on screen aswell within certain bound
    const squareID = id;
    id++;

    const s = Math.random() * 15 + 15; // between 15 and 30
    const sq = {s, width, height};

    const {x, y, vX, vY} = sideSwitch[side ?? randomSide()](sq);

    return {
        id: squareID,
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
let paused = false;

type Square = {
    id: number;
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
        const {width, height} = ctx.canvas;
        const target = vector(width / 2, height / 2);

        const sqToRemoveByID: number[] = [];

        let count = 0;
        const countIncrease = 10;
        let threshold = 0;
        let permaAtX = 0;
        let permaAtY = 0;

        addEventListener('keydown', ({code}) => {
            if (code === 'KeyW') squares.push(createSquare(width, height, 'top'));
            if (code === 'KeyS') squares.push(createSquare(width, height, 'bottom'));
            if (code === 'KeyA') squares.push(createSquare(width, height, 'left'));
            if (code === 'KeyD') squares.push(createSquare(width, height, 'right'));
        });

        const name = 'demo update';
        const fn = () => {
            for (let i = 0; i < squares.length; i++) {
                const sq = squares[i];

                sq.x += sq.vX;
                sq.y += sq.vY;

                // collision (outside of screen)
                if (sq.x < -sq.s || sq.x > width || sq.y < -sq.s || sq.y > height) {
                    sqToRemoveByID.push(sq.id);

                    continue;
                }

                sq.angle += sq.angleVel;
                sq.alpha -= sq.alphaVel;

                if (sq.alpha < sq.minAlpha) {
                    sq.alpha = sq.minAlpha;
                    sq.alphaVel *= -1;
                } else if (sq.alpha > sq.maxAlpha) {
                    sq.alpha = sq.maxAlpha;
                    sq.alphaVel *= -1;
                    sq.blinked++;

                    if (sq.blinked === 2 && permaSquares.length < 20) {
                        addPermaSquare(sq);
                        sq.blinked = 0;

                        console.log(`squares length: ${squares.length}`);
                        console.log(`permaSquares length: ${permaSquares.length}`);

                        // run a function
                        if (permaSquares.length === 20) permaSquareAnimateX(permaSquares, target);
                    }
                }
            }

            for (let i = 0; i < permaSquares.length; i++) {
                const psq = permaSquares[i];

                psq.x += psq.vX;
                psq.y += psq.vY;

                if (permaAnimatingX) {
                    const distanceLeftToTarget = Math.abs(target.x - psq.x);

                    if (distanceLeftToTarget < 5) {
                        psq.x = target.x;
                        psq.vX = 0;

                        permaAtX++;
                    }
                } else if (permaAnimatingY) {
                    const distanceLeftToTarget = Math.abs(target.y - psq.y);

                    if (distanceLeftToTarget < 5) {
                        psq.y = target.y;
                        psq.vY = 0;

                        permaAtY++;

                        if (permaAtY === 20) {
                            permaAtY = 0;
                            permaAnimatingY = false;
                            permaSquareAnimateNextPhase(permaSquares, target);
                        }
                    }
                }

                if (permaAtX === 20) {
                    console.log(permaSquares);

                    permaAtX = 0;
                    permaAnimatingX = false;
                    permaSquareAnimateY(permaSquares, target);
                }
            }

            count++;

            if (count > threshold && !paused) {
                threshold += countIncrease;
                squares.push(createSquare(width, height));
            }

            // remove squares out of bound of view
            for (let i = 0; i < sqToRemoveByID.length; i++) {
                const indexToRemove = squares.findIndex(square => square.id === sqToRemoveByID[i]);

                squares.splice(indexToRemove, 1);
            }

            sqToRemoveByID.length = 0;
        };

        return {id, name, fn};
    },
    createDemoShow: () => {
        const {context: ctx} = resources.state;

        const name = 'demo show';
        const fn = () => {
            for (let i = 0; i < squares.length; i++) {
                const sq = squares[i];

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

                // showCollisionCorners(ctx, sq);
            }

            for (let i = 0; i < permaSquares.length; i++) {
                const sq = permaSquares[i];

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

export const showCollisionCorners = (ctx: CanvasRenderingContext2D, sq: Square) => {
    // TL
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(sq.x, sq.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // TR
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(sq.x + sq.s, sq.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // BL
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(sq.x, sq.y + sq.s, 4, 0, Math.PI * 2);
    ctx.fill();

    // BR
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(sq.x + sq.s, sq.y + sq.s, 4, 0, Math.PI * 2);
    ctx.fill();
};

const permaSquareAnimateNextPhase = (permaSq: Square[], target: Vector) => {
    console.log('permaSquareLastPhase initiating');
};

let permaAnimatingX = false;
let permaAnimatingY = false;

const permaSquareAnimateX = (permaSq: Square[], target: Vector) => {
    permaAnimatingX = true;
    paused = true;
    // move all x positions to middle of screen with a certain speed
    for (let i = 0; i < permaSq.length; i++) {
        const psq = permaSq[i];
        const distanceX = target.x - psq.x;
        psq.vX = distanceX / 180; // 60 ms = 1 second till middle is reached
    }
};

const permaSquareAnimateY = (permaSq: Square[], target: Vector) => {
    permaAnimatingY = true;
    // move all y positions to middle of screen with a certain speed
    for (let i = 0; i < permaSq.length; i++) {
        const psq = permaSq[i];
        const distanceY = target.y - psq.y;
        psq.vY = distanceY / 180; // 60 ms = 1 second till middle is reached
    }
};

const addPermaSquare = (sq: Square) => {
    const newSq = {...sq};
    newSq.vX = 0;
    newSq.vY = 0;
    permaSquares.push(newSq);
};
