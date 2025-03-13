import {EntitySketch} from 'library/types/entity';
import {ShapeMap, defaultShapes} from './shapes';

export const createDefaultSketch = (ctx: CanvasRenderingContext2D) => ({
    rect: () => {
        const shape = {...defaultShapes['rect']};

        const draw = () => {
            ctx.fillStyle = shape.fill;

            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.w, shape.h);
            ctx.fill();
        };

        return {shape, draw};
    },
    circle: () => {
        const shape = {...defaultShapes['circle']};

        const draw = () => {
            ctx.fillStyle = shape.fill;

            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            ctx.fill();
        };

        return {shape, draw};
    },
    text: () => {
        const shape = {...defaultShapes['text']};

        const draw = () => {
            ctx.fillStyle = shape.textFill;
            ctx.font = `${shape.fontSize}px ${shape.font}`;
            ctx.textAlign = shape.textAlign;
            ctx.textBaseline = shape.textBaseLine;

            ctx.beginPath();
            ctx.fillText(shape.text, shape.x, shape.y + 1.5);
        };

        return {shape, draw};
    },
});
