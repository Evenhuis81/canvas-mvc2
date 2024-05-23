import {FillCircle} from '../types/tv';

export const getPaintMethods = (ctx: CanvasRenderingContext2D) => ({
    fillCircle: createFillCircle(ctx),
});

const createFillCircle = (ctx: CanvasRenderingContext2D) => (obj: FillCircle) => {
    ctx.fillStyle = obj.fill;

    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
    ctx.fill();
};
