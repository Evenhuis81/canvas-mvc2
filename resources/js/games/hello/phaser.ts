import {Phaser} from './types';

const createProps: () => Phaser = () => ({
    // Calculate time passed on each frame and total time for each phase and divide those for each update
    // timer: {
    //     last: 0,
    // passed: 0,
    // distance: 0,
    // },
    time: 0,
    number: 0,
    end: 4, // make optional, default 0 (or 1)
    shifts: [],
    // TOOD::Pre- and postpare for phase method, tuple 3rd and 4th entry
    phases: {0: ['phase0']},
    start: () => {},
});

export const createPhaser = (engine: Engine) => {
    const props = createProps();

    props.shifts = [0, 4000, 7000, 11000];

    const setPhase = () => {
        //
    };

    const update = createUpdate(engine, props);

    props.start = () => {
        engine.setUpdate(update);

        engine.setUpdate({
            id: props.phases[props.number][0],
            fn: props.phases[props.number][1],
        });
    };

    return props;
};

const createUpdate = (engine: Engine, phaser: Phaser) => ({
    id: 'phases-update',
    name: 'update Phases',
    fn: (evt: UpdateEvent) => {
        phaser.time += evt.timePassed;

        if (phaser.shifts[phaser.number] < phaser.time) {
            engine.removeUpdate(phaser.phases[phaser.number][0]);

            phaser.number++;

            // if (phaser.number === phaser.end) {
            if (!phaser.phases[phaser.number + 1]) {
                engine.removeUpdate('phases-update');

                engine.removeDraw('demo-circy');
                engine.removeDraw('stats-circy-phases');

                console.log('phaser ended');

                return;
            }

            engine.setUpdate({
                id: phaser.phases[phaser.number][0],
                fn: phaser.phases[phaser.number][1],
            });
        }
    },
});
