import {MethodsTV, PropertiesTV} from 'library/types/views';

export default (
    {screen, screen2}: PropertiesTV,
    {world2Screen, world2Screen2}: MethodsTV,
    ctx: CanvasRenderingContext2D,
) => ({
    line: (x1: number, y1: number, x2: number, y2: number) => () => {
        const screen2 = world2Screen2(x1, y1, x2, y2);

        ctx.moveTo(screen2.x1, screen2.y1);
        ctx.lineTo(screen2.x2, screen2.y2);
    },
});
