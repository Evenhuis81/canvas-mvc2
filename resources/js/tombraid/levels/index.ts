import {gameStore} from '../store';
import {getLevelMap} from './levels';
import {vector} from 'library/canvas';

export const getLevel = (id: number) => {
    const levelMap = getLevelMap(id);

    const show = () => {
        for (let y = 0; y < levelMap.length; y++) {
            for (let x = 0; x < levelMap[y].length; x++) {
                switch (levelMap[y][x]) {
                    case 'X':
                        gameStore.state.tv.strokeRect(x, y, 1, 1, 'red');
                        break;
                    case 'T':
                        gameStore.state.tv.strokeRect(x, y, 1, 1, 'blue');
                        break;
                    default:
                        break;
                }
            }
        }
    };

    return {
        map: levelMap,
        width: levelMap[0].length,
        height: levelMap.length,
        playerStart: vector(2, 2), // TODO:: get playerStart from levelMap automatically
        show,
    };
};
