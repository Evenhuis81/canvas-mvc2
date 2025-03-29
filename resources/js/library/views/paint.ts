import {MethodsTV, PropertiesTV} from 'library/types/views';

export const createOldPaintMethods = (props: PropertiesTV, methods: MethodsTV, ctx: CanvasRenderingContext2D) => ({
    base: {
        //
    },
});

export const getPaintMethods = () => ({
    // fillRect: createFillRect(props, methods, ctx),
    // strokeRect: createStrokeRect(props, methods, ctx),
    // line: createLine(props, methods, ctx),
    // text: createFillText(props, methods, ctx),
    // fillStrokeRect: createFillStrokeRect(props, methods, ctx),
    // roundFillStrokeRect: createRoundFillStrokeRect(props, methods, ctx),
    // roundRectStroke: createRoundRectStroke(props, methods, ctx),
    // fillCircle: createFillCircle(props, methods, ctx),
    // strokeCircle: createStrokeCircle(props, methods, ctx),
    // fillStrokeCircle: createFillStrokeCircle(props, methods, ctx),
});

const createFillStrokeCircle =
    (props: PropertiesTV, methods: MethodsTV, ctx: CanvasRenderingContext2D) => (obj: TVFillStrokeCircle) => {
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
    (obj: TVStrokeCircle) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;

        ctx.lineWidth = obj.lw * scale.x;

        ctx.beginPath();

        ctx.arc(screen.x, screen.y, obj.r * scale.x, obj.rS, obj.rE);

        ctx.stroke();
    };

const createFillCircle =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVFillCircle) => {
        world2Screen(obj.x, obj.y);

        ctx.fillStyle = obj.fill;

        ctx.beginPath();

        ctx.arc(screen.x, screen.y, obj.r * scale.x, 0, Math.PI * 2);

        ctx.fill();
    };

const createFillRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVFillRect) => {
        world2Screen(obj.x, obj.y);

        ctx.fillStyle = obj.fill;

        ctx.fillRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
    };

const createStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVStrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.lineWidth = obj.lw * scale.x;

        ctx.beginPath();
        ctx.strokeRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
    };

const createLine =
    ({screen2}: PropertiesTV, {world2Screen2}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (x1: number, y1: number, x2: number, y2: number) => {
        world2Screen2(x1, y1, x2, y2);

        // ctx.lineWidth = obj.lw * scale.x;
        // ctx.strokeStyle = obj.stroke;

        // ctx.beginPath();
        ctx.moveTo(screen2.x, screen2.y);
        ctx.lineTo(screen2.x2, screen2.y2);
        // ctx.stroke();
    };

const createLine2 =
    ({screen2, scale}: PropertiesTV, {world2Screen2}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVLine) => {
        world2Screen2(obj.x, obj.y, obj.x2, obj.y2);

        ctx.lineWidth = obj.lw * scale.x;
        ctx.strokeStyle = obj.stroke;

        ctx.beginPath();
        ctx.moveTo(screen2.x, screen2.y);
        ctx.lineTo(screen2.x2, screen2.y2);
        ctx.stroke();
    };

const createFillText =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVText) => {
        world2Screen(obj.x, obj.y);

        const font = `${obj.fontSize ? obj.fontSize * scale.x : 24 * scale.x}px ${obj.font ?? 'monospace'}`;

        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = obj.fill;

        ctx.fillText(obj.txt, screen.x, screen.y);
    };

const createFillStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVFillStrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.fillStyle = obj.fill;
        ctx.lineWidth = obj.lw * scale.x;

        ctx.beginPath();
        ctx.rect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y);
        ctx.fill();
        ctx.stroke();
    };

const createRoundFillStrokeRect =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (obj: TVRoundFillStrokeRect) => {
        world2Screen(obj.x, obj.y);

        ctx.strokeStyle = obj.stroke;
        ctx.fillStyle = obj.fill;
        ctx.lineWidth = obj.lw * scale.x;

        ctx.beginPath();
        ctx.roundRect(screen.x, screen.y, obj.w * scale.x, obj.h * scale.y, obj.r * scale.x);
        ctx.fill();
        ctx.stroke();
    };

const createRoundRectStroke =
    ({screen, scale}: PropertiesTV, {world2Screen}: MethodsTV, ctx: CanvasRenderingContext2D) =>
    (x: number, y: number, w: number, h: number, radii: number) => {
        world2Screen(x, y);

        ctx.beginPath();
        ctx.roundRect(screen.x, screen.y, w * scale.x, h * scale.y, radii);
        ctx.stroke();
    };
