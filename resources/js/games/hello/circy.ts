import {resources} from 'library/index';

export const getCircy = () => {
    const {context: ctx, canvas, engine} = resources.hello;

    const props = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        lineWidth: 0,
        fillStyle: '#000',
        strokeStyle: '#fff',
        radius: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
    };

    const drawStats = {
        id: 'stats-circy-phases',
        name: 'Phases Statistics for Circy',
        fn: () => {
            ctx.beginPath();

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px monospace';
            ctx.fillStyle = '#fff';

            ctx.fillText(
                `phase: ${phaseNumber}, timer: ${engine.info.time.last().toFixed(0)}`,
                canvas.width / 2,
                canvas.height - 100,
            );

            ctx.fillText(`shifting phase at: ${phaseShift[phaseNumber]}ms`, canvas.width / 2, canvas.height - 75);

            ctx.fillText(
                `engine updates: ${engine.info.updates.length()}, draws: ${engine.info.draws.length()}`,
                canvas.width / 2,
                canvas.height - 50,
            );
        },
    };

    const draw = {
        id: 'demo-circy',
        name: 'Circy Demo Draw',
        fn: () => {
            ctx.beginPath();

            ctx.fillStyle = props.fillStyle;
            ctx.strokeStyle = props.strokeStyle;
            ctx.lineWidth = props.lineWidth;

            ctx.arc(props.x, props.y, props.radius, props.startAngle, props.endAngle, props.counterclockwise);
            ctx.fill();
            ctx.stroke();
        },
    };

    let timer = 0;
    let phaseNumber = 0;

    const phaseShift = [2000, 5000, 8000, 10000, 999999999999];
    // const phaseShift = [500, 1000, 1500, 2000, 999999999999];

    const update = {
        id: 'phases-update',
        name: 'update Phases',
        fn: (evt: UpdateEvent) => {
            timer = evt.lastTime;

            if (phaseShift[phaseNumber] < evt.lastTime) {
                engine.removeUpdate(phases[phaseNumber][0]);

                phaseNumber++;

                if (phaseNumber === 4) {
                    engine.removeUpdate('phases-update');

                    engine.removeDraw('demo-circy');
                    engine.removeDraw('stats-circy-phases');

                    console.log('end phases, removed general update');
                    console.log(engine.info.draws.ids(), engine.info.updates.ids());

                    return;
                }

                // Name property for update needed?
                engine.setUpdate({
                    id: phases[phaseNumber][0],
                    fn: phases[phaseNumber][1],
                });
            }
        },
    };

    const update1 = () => {};

    const update2 = () => {
        console.log('phase 2 running');
    };

    const update3 = () => {
        console.log('phase 3 running');
    };

    const update4 = () => {
        console.log('phase 4 running');
    };

    const update5 = () => {
        console.log('phase 5 running');
    };

    const phases: Record<number, [string, () => void]> = {
        0: ['phase0', () => {}],
        1: ['phase1', update1],
        2: ['phase2', update2],
        3: ['phase3', update3],
        4: ['phase4', update4],
        5: ['phase5', update5],
    };

    engine.setUpdate({
        id: phases[phaseNumber][0],
        fn: phases[phaseNumber][1],
    });

    return {draw, drawStats, update};
};
