export const createPhaser = () => {
    props.phaser.shifts.length = 0;
    props.phaser.shifts = [2000, 4000, 7000, 11000, 999999999999];

    // const {sketch, phaser, timer} = props;

    // const timerProperties = {
    //     timeDistance: 0,
    //     timeLast: 0,
    // };

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
};
