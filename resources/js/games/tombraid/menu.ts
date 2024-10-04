import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const goToMenu = () => {
    const entity = createEntity('tr');

    const level1 = entity.create();

    // Need entity to have option to set handler after creation (and run() or someting)
};

const createLevelButtons = () => {
    const buttonBase = {
        x: 80,
        y: 50,
        text: 'Start #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
        mouse: {
            up: () => {
                // touch missing
                // level1.hide();
            },
        },
        onEndEnd: () => {
            startLevel(1);
        },
    };
};
