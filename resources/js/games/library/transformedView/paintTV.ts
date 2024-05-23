import type {
    FillCircle,
    FillRect,
    FillStrokeRect,
    Line,
    RoundFillStrokeRect,
    StrokeRect,
    TVProperties,
    Text,
} from '../types/tv';

export const getPaintMethodsTV = (tv: TVProperties, ctx: CanvasRenderingContext2D) => ({
    fillRect: createFillRect(tv, ctx),
    strokeRect: createStrokeRect(tv, ctx),
    line: createLine(tv, ctx),
    text: createText(tv, ctx),
    fillStrokeRect: createFillStrokeRect(tv, ctx),
    roundFillStrokeRect: createRoundFillStrokeRect(tv, ctx),
    fillCircle: createFillCircle(tv, ctx),
});

const createFillCircle = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: FillCircle) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.fillStyle = obj.fill;

    ctx.beginPath();

    ctx.arc(tv.screen.x, tv.screen.y, obj.r * tv.scale.x, 0, Math.PI * 2);

    ctx.fill();
};

const createFillRect = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: FillRect) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.fillStyle = obj.fill;

    ctx.fillRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const createStrokeRect = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: StrokeRect) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.stroke;

    ctx.strokeRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
};

const createLine = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: Line) => {
    tv.world2Screen2(obj.x, obj.y, obj.x2, obj.y2);

    ctx.lineWidth = tv.scale.x * 0.1; // make non-hardcorded
    ctx.strokeStyle = obj.stroke;

    ctx.beginPath();
    ctx.moveTo(tv.screen.x, tv.screen.y);
    ctx.lineTo(tv.screen.x2, tv.screen.y2);
    ctx.stroke();
};

const createText = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: Text) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.font = `${tv.scale.x}px serif`; // make non-hardcoded
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = obj.fill;

    ctx.fillText(obj.txt, tv.screen.x, tv.screen.y);
};

const createFillStrokeRect = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: FillStrokeRect) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.stroke;
    ctx.fillStyle = obj.fill;

    ctx.beginPath();
    ctx.rect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y);
    ctx.fill();
    ctx.stroke();
};

const createRoundFillStrokeRect = (tv: TVProperties, ctx: CanvasRenderingContext2D) => (obj: RoundFillStrokeRect) => {
    tv.world2Screen(obj.x, obj.y);

    ctx.strokeStyle = obj.stroke;
    ctx.fillStyle = obj.fill;

    ctx.beginPath();
    ctx.roundRect(tv.screen.x, tv.screen.y, obj.w * tv.scale.x, obj.h * tv.scale.y, obj.r * tv.scale.x);
    ctx.fill();
    ctx.stroke();
};
