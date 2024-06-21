const getGrid = (ctx: CanvasRenderingContext2D) => {
    const {worldTL, worldBR, worldView, offset, scale, screen} = properties;

    const show = {
        id: 89,
        name: 'tv grid',
        fn: () => {
            // This is technically an update
            setWorldView(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.strokeStyle = '#bbbb';
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Columns
            for (let x = worldTL.x; x <= worldBR.x; x++) {
                if (x >= worldView.x && x <= worldView.x2) {
                    world2Screen(x, worldTL.y);

                    ctx.moveTo(screen.x, screen.y);
                    ctx.lineTo(screen.x, (worldBR.y - offset.y) * scale.y);
                }
            }

            // Rows
            for (let y = worldTL.y; y <= worldBR.y; y++) {
                if (y >= worldView.y && y <= worldView.y2) {
                    world2Screen(worldTL.x, y);

                    ctx.moveTo(screen.x, screen.y);
                    ctx.lineTo((worldBR.x - offset.x) * scale.x, screen.y);
                }
            }

            ctx.stroke();
        },
    };

    return show;
};
