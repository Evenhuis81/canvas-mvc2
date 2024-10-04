import createEntity from 'library/entity';
import {getLevel} from './levels';
import {vector, vector2} from 'library/vector';
import {getPlayer} from './player';

export const levelResource: Record<number, LevelResource> = {};
export const playerResource: Record<number, PlayerProperties> = {};

export const goToMenu = () => {
    const entity = createEntity('tr');

    const startButton = entity.create({
        x: 80,
        y: 50,
        text: 'Start #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 2,
        mouse: {
            up: () => {
                // touch missing
                startButton.hide();
            },
        },
        onEndEnd: () => {
            console.log('onEndEnd');
            // startLevel(2, tv, context, canvas, engine);
        },
    });
};
