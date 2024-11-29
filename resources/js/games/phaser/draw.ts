import {CircySketch, Phaser} from './types';

export const createDrawStats = (
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    phaser: Phaser,
    halfWidth: number,
    height: number,
) => {
    // ) => ({
    //     id: 'stats-circy-phases',
    //     name: 'Phases Statistics for Circy',
    //     fn: () => {
    ctx.beginPath();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px monospace';
    ctx.fillStyle = '#fff';

    ctx.fillText(`phase: ${phaser.number}, timer: ${engine.info.time.last().toFixed(0)}`, halfWidth, height - 100);

    // ctx.fillText(`shifting phase at: ${phaser.shifts[phaser.number]}ms`, halfWidth, height - 75);

    ctx.fillText(
        `engine updates: ${engine.info.updates.length()}, draws: ${engine.info.draws.length()}`,
        halfWidth,
        height - 50,
    );
};

export const createDraw = (ctx: CanvasRenderingContext2D, sketch: CircySketch) => {
    // id: 'demo-circy',
    // name: 'Circy Demo Draw',
    // fn: () => {

    ctx.beginPath();

    ctx.fillStyle = sketch.fillStyle;
    ctx.strokeStyle = sketch.strokeStyle;
    ctx.lineWidth = sketch.lineWidth;

    ctx.arc(sketch.x, sketch.y, sketch.radius, sketch.startAngle, sketch.endAngle, sketch.counterclockwise);
    ctx.fill();
    ctx.stroke();
};
