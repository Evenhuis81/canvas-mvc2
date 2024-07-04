import type {
    FillCircle,
    FillRect,
    FillStrokeCircle,
    FillStrokeRect,
    Line,
    MethodsTV,
    PropertiesTV,
    RoundFillStrokeRect,
    StrokeCircle,
    StrokeRect,
    Text,
} from '../types/tv';

export const getPaintMethods = (props: PropertiesTV, methods: MethodsTV, ctx: CanvasRenderingContext2D) => ({
    fillRect: createFillRect(props, methods, ctx),
    strokeRect: createStrokeRect(props, methods, ctx),
    line: createLine(props, methods, ctx),
    text: createText(props, methods, ctx),
    fillStrokeRect: createFillStrokeRect(props, methods, ctx),
    roundFillStrokeRect: createRoundFillStrokeRect(props, methods, ctx),
    fillCircle: createFillCircle(props, methods, ctx),
    strokeCircle: createStrokeCircle(props, methods, ctx),
    fillStrokeCircle: createFillStrokeCircle(props, methods, ctx),
});

const createFillStrokeCircle =
    (props: PropertiesTV, methods: MethodsTV, ctx: CanvasRenderingContext2D) => (obj: FillStrokeCircle) => {
        methods.world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.fillStyle = obj.fill;
        ctx.lineWidth = obj.lw / props.scale.x;

        ctx.beginPath();

        ctx.arc(props.screen.x, props.screen.y, obj.r * props.scale.x, obj.rS, obj.rE);

        ctx.fill();
        ctx.stroke();
    };

const createStrokeCircle =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: StrokeCircle) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;

        // set scale for every weight of line and others
        ctx.lineWidth = obj.lw / scale.x;

        ctx.beginPath();

        ctx.arc(screen.x, screen.y, obj.r * scale.x, obj.rS, obj.rE);

        ctx.stroke();
    };

const createFillCircle =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: FillCircle) => {
        world2Screen(obj.x, obj.y);

        ctx.fillStyle = obj.fill;

        ctx.beginPath();

        ctx.arc(screen.x, screen.y, obj.r * scale.x, 0, Math.PI * 2);

        ctx.fill();
    };

const createFillRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: FillRect) => {
        world2Screen(obj.x, obj.y);

        ctx.fillStyle = obj.fill;

        ctx.fillRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
    };

const createStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: StrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.lineWidth = obj.lw / (scale.x * 0.1);

        ctx.beginPath();
        ctx.strokeRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
    };

const createLine =
    ({screen2, scale}: PropertiesTV, {world2Screen2}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: Line) => {
        world2Screen2(obj.x, obj.y, obj.x2, obj.y2);

        ctx.lineWidth = scale.x * 0.1; // make non-hardcorded
        ctx.strokeStyle = obj.stroke;

        ctx.beginPath();
        ctx.moveTo(screen2.x, screen2.y);
        ctx.lineTo(screen2.x2, screen2.y2);
        ctx.stroke();
    };

const createText =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: Text) => {
        world2Screen(obj.x, obj.y);

        ctx.font = `${scale.x}px serif`; // make non-hardcoded
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = obj.fill;

        ctx.fillText(obj.txt, screen.x, screen.y);
    };

const createFillStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: FillStrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.fillStyle = obj.fill;
        ctx.lineWidth = obj.lw;

        ctx.beginPath();
        ctx.rect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
        ctx.fill();
        ctx.stroke();
    };

const createRoundFillStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: RoundFillStrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.fillStyle = obj.fill;

        ctx.beginPath();
        ctx.roundRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y, obj.r * scale.x);
        ctx.fill();
        ctx.stroke();
    };
