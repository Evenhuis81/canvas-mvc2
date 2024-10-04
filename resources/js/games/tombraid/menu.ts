import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const goToMenu = () => {
    const entity = createEntity('tr');

    const level1 = entity.create();

    // level1.setHandlers();

    // mouse: {
    //     up: () => {
    //         // touch missing
    //         // level1.hide();
    //     },
    // },
    // onEndEnd: () => {
    //     startLevel(1);
    // },
};

const createLevelButtons = (amount: number) => {
    // const buttons: Entity = [];

    for (let i = 0; i < 5; i++) {}

    const buttonBase = {
        x: 80,
        y: 50,
        text: 'Start #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
    };
};
