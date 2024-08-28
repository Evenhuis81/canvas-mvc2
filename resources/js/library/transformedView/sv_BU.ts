// import {FillCircle, Text} from 'library/types/tv';

// interface CircleFill {
//     type: 'circleFill';
//     x: number;
//     y: number;
//     r: number;
//     fill: string;
// }
// interface TextFill {
//     type: 'textFill';
//     x: number;
//     y: number;
//     txt: string;
//     // font?: string;
//     fill: string;
//     // fontSize?: number;
// }

// type SVPaint = CircleFill | TextFill;

// type TaskType = 'circleFill' | 'textFill';

// type SomeTask<T extends TaskType = TaskType> = { [K in T]: PaintMethods<K> }[T];

// function genericExecute<K extends TaskType>(task: SomeTask<K>) {
//     action_map[task.type].execute(task); // okay
// }

// export const getSV = (context: CanvasRenderingContext2D) => {
//     // const text = createText(context);
//     // const fillCircle = createFillCircle(context);

//     const paintMethods = createPaintMethods(context);

//     // Extract<Resource, { type: R }>

//     const paint = <K extends TaskType>(paintObject: Extract<SVPaint, {type: K}>) => {
//         paintMethods[paintObject.type](paintObject);
//     };

//     return {paint};
// };

// interface PaintMethods {
//     circleFill: (obj: CircleFill) => void;
//     textFill: (obj: TextFill) => void;
// }

// const createPaintMethods = (context: CanvasRenderingContext2D) => ({
//     circleFill: (obj: CircleFill) => createCircleFill(context, obj),
//     textFill: (obj: TextFill) => createTextFill(context, obj),
// });

// const createTextFill = (ctx: CanvasRenderingContext2D, obj: TextFill) => () => {
//     // const font = `${obj.fontSize ? obj.fontSize : 24}px ${obj.font ?? 'monospace'}`;

//     // ctx.font = font;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillStyle = obj.fill;

//     ctx.fillText(obj.txt, obj.x, obj.y);
// };

// const createCircleFill = (ctx: CanvasRenderingContext2D, obj: CircleFill) => () => {
//     ctx.fillStyle = obj.fill;

//     ctx.beginPath();

//     ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);

//     ctx.fill();
// };
