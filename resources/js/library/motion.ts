import {TransformedView} from './types/views';

export const createVehicle = (tv: TransformedView, ctx: CanvasRenderingContext2D, unitLength: number) => {
    const pos = {x: 0, y: 0};
    const vel = {x: 0, y: 0};
    const acc = {x: 0, y: 0};

    const props = {
        fillStyle: '#f00',
        strokeStyle: '#0f0',
        maxSpeed: 0.05,
        radius: 0.5 * unitLength,
    };

    const update = () => {
        vel.x += acc.x;
        vel.y += acc.y;
        pos.x += vel.x;
        pos.y += vel.y;
    };

    const steer = () => {
        //
    };

    // TOOD::Use TransformedView
    const draw = () => {
        ctx.fillStyle = props.fillStyle;
        ctx.strokeStyle = props.strokeStyle;

        ctx.beginPath();

        ctx.moveTo(pos.x + props.radius, pos.y - props.radius); // x1 & y1 (top)
        ctx.lineTo(pos.x + unitLength, pos.y + props.radius); // x2 & y2 (bottom-right)
        ctx.lineTo(pos.x, pos.y + props.radius); // x3 & y3 (bottom-left)

        ctx.closePath(); // 3 -> 1

        ctx.fill();
        ctx.stroke();
    };

    return {update, draw, pos, vel, acc, props};
};
