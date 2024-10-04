import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const goToMenu = () => {
    const entity = createEntity('tr');

    const startButton = entity.create({
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
                startButton.hide();
            },
        },
        onEndEnd: () => {
            startLevel(1);
        },
    });
};
