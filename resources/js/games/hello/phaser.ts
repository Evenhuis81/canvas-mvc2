import {Phaser} from './types';

const createProps: () => Phaser = () => ({
    // Calculate time passed on each frame and total time for each phase and divide those for each update
    timer: {
        time: 0,
        last: 0,
        passed: 0,
        distance: 0,
    },
    number: 0,
    end: 4,
    shifts: [0],
    // TOOD::Pre- and postpare for phase method, tuple 3rd and 4th entry
    phases: {0: ['phase0', () => {}]},
});

export const createPhaser = () => {
    const props = createProps();
    // props.phaser.shifts.length = 0;
    props.shifts = [2000, 4000, 7000, 11000, 999999999999];

    for (let i = 0; i < 6; i++)
        props.phases[i + 1] = [
            `phase${i + 1}`,
            () => {
                console.log(`phase ${i + 1} running`);
            },
        ];

    return props;
};
