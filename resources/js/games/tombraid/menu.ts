import createEntity from 'library/entity';
import {getLevel} from './levels';
import {vector, vector2} from 'library/vector';
import {getPlayer} from './player';
import {resources} from 'library/index';

export const levelResource: Record<number, LevelResource> = {};
export const playerResource: Record<any, any> = {};

export const goToMenu = () => {
    const entity = createEntity('tr');

    entity.create({
        x: 80,
        y: 50,
        text: 'Start #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
        mouse: {
            up: () => {
                // if (startButton.inside()) startLevel(2, tv, context, canvas, engine);
            },
        },
        onEndEnd: () => {
            console.log('onEndEnd');
        },
    });

    // statistics.state.set({
    //     id: 8,
    //     name: 'player (middle) pos',
    //     fn: () => `player.x: ${player.middlePos.x}, player.y: ${player.middlePos.y}`,
    // });

    // statistics.state.setFn(() => `${tv.scale.x}`);
    // };
};
