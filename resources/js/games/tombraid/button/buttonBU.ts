// export const getDefaultButton = (ctx: CanvasRenderingContext2D) => {
//     const show = () => {
//         const {txt, x, y, w, h, r, lw, strokeColor, fillColor, textColor, font} = defaultButton;
//         // make 2 seperate non-tv functions for rendering rects (round/fill/stroke) and text (text-project)

//         // button
//         ctx.fillStyle = fillColor;
//         ctx.strokeStyle = strokeColor;
//         ctx.lineWidth = lw;

//         ctx.beginPath();
//         ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
//         ctx.fill();
//         ctx.stroke();

//         // text
//         ctx.fillStyle = textColor;
//         ctx.font = font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.fillText(txt, x, y);
//     };

//     return {show};
// };
