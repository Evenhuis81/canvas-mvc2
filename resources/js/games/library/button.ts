const defaultButton = {
    txt: 'default button',
    x: 250,
    y: 250,
    w: 100,
    h: 30,
    r: 0,
    lw: 2,
    color: '#fff',
};

export const getDefaultButton = (ctx: CanvasRenderingContext2D) => {
    const show = () => {
        const {txt, x, y, w, h, r, lw, color} = defaultButton;

        // button
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;

        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
        ctx.stroke();

        // text
        ctx.font = '16px bold serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(txt, x, y);
    };

    return {show};
};
