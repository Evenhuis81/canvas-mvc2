import {resources} from 'library/index';

export const getCircy = () => {
    const {context: ctx, canvas, engine} = resources.hello;

    const start = () => {
        resources.hello.engine.setDraw(draw);
        resources.hello.engine.setDraw(drawStats);
        resources.hello.engine.setUpdate(update);
    };

    const props = {
        sketch: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            lineWidth: 0,
            fillStyle: '#000',
            strokeStyle: '#fff',
            radius: 0,
            startAngle: 0,
            endAngle: Math.PI * 2,
            counterclockwise: false,
        },
        // Calculate time passed on each frame and total time for each phase and divide those for each update
        timer: {
            time: 0,
            lastTime: 0,
            timePassed: 0,
        },
        phaser: {
            number: 0,
            end: 4,
            shifts: [0],
        },
    };

    props.phaser.shifts.length = 0;
    props.phaser.shifts = [2000, 5000, 8000, 10000, 999999999999];

    const {sketch, phaser, timer} = props;

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
                `phase: ${phaser.number}, timer: ${engine.info.time.last().toFixed(0)}`,
                canvas.width / 2,
                canvas.height - 100,
            );

            ctx.fillText(`shifting phase at: ${phaser.shifts[phaser.number]}ms`, canvas.width / 2, canvas.height - 75);

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

            ctx.fillStyle = sketch.fillStyle;
            ctx.strokeStyle = sketch.strokeStyle;
            ctx.lineWidth = sketch.lineWidth;

            ctx.arc(sketch.x, sketch.y, sketch.radius, sketch.startAngle, sketch.endAngle, sketch.counterclockwise);
            ctx.fill();
            ctx.stroke();
        },
    };

    const update = {
        id: 'phases-update',
        name: 'update Phases',
        fn: (evt: UpdateEvent) => {
            timer.time = evt.lastTime;

            if (phaser.shifts[phaser.number] < evt.lastTime) {
                engine.removeUpdate(phases[phaser.number][0]);

                phaser.number++;

                if (phaser.number === phaser.end) {
                    engine.removeUpdate('phases-update');

                    engine.removeDraw('demo-circy');
                    engine.removeDraw('stats-circy-phases');

                    console.log('end phases, removed general update');
                    console.log(engine.info.draws.ids(), engine.info.updates.ids());

                    return;
                }

                // Name property for update needed?
                engine.setUpdate({
                    id: phases[phaser.number][0],
                    fn: phases[phaser.number][1],
                });
            }
        },
    };

    const timerProperties = {
        timeDistance: 0,
        timeLast: 0,
    };

    // const prepareTest = () => {

    // }

    const update1 = () => {
        console.log('phase 1 running');
    };

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

    // TOOD::Pre- and postpare for phase method, tuple 3rd and 4th entry
    const phases: Record<number, [string, () => void]> = {
        0: ['phase0', () => {}],
        1: ['phase1', update1],
        2: ['phase2', update2],
        3: ['phase3', update3],
        4: ['phase4', update4],
        5: ['phase5', update5],
    };

    engine.setUpdate({
        id: phases[phaser.number][0],
        fn: phases[phaser.number][1],
    });

    return {draw, drawStats, update, start};
};
