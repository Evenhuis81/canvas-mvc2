/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-param-reassign */
// import {StrokeRectObj} from 'library/types/tv';
import {Level, MapElement} from 'types/level';
import {gameStore} from '../store';
import {getLevelMap} from './levels';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';

// type XElement = {
//     type: 'strokeRect';
//     show: () => void;
//     attr: StrokeRectObj;
// };
// type DotElement = object;
// type TrapElement = {
//     type: 'strokeRect';
//     show: () => void;
//     attr: StrokeRectObj;
// };
// type StartElement = object;

// interface Elements {
//     X: XElement;
//     '.': DotElement;
//     T: TrapElement;
//     S: StartElement;
// }

// const elements: Elements = {
//     X: {
//         type: 'strokeRect',
//         show: () => {
//             console.log('show X');
//         },
//         attr: {
//             x: 0,
//             y: 0,
//             w: 1,
//             h: 1,
//             color: 'red',
//         },
//     },
//     '.': {
//         // show: () => {
//         //     console.log('show .');
//         // },
//     },
//     S: {
//         // show: () => {
//         //     console.log('show S');
//         // },
//     },
//     T: {
//         type: 'strokeRect',
//         show: () => {
//             console.log('show T');
//         },
//         attr: {
//             x: 0,
//             y: 0,
//             w: 1,
//             h: 1,
//             color: 'blue',
//         },
//     },
// };

const getEmptyXFromRow = (levelMapRow: MapElement[], emptiesRow: number[], count = 0) => {
    while (levelMapRow[count] === '.' || levelMapRow[count] === 'S') count++;

    emptiesRow.push(count);

    if (++count === levelMapRow.length) return;

    getEmptyXFromRow(levelMapRow, emptiesRow, count);
};

const getEmptyX = (levelMap: Level) => {
    const empties: number[][] = [];

    for (let y = 0; y < levelMap.length; y++) {
        empties.push([]);

        getEmptyXFromRow(levelMap[y], empties[y]);
    }

    return empties;
};

export const getLevel = (id: number) => {
    const levelMap = getLevelMap(id);

    const noEmptyX = getEmptyX(levelMap);

    const elementsDrawn = {nr: 0};

    setStatistic(() => `elements drawn: ${elementsDrawn.nr}`);

    const show = () => {
        const {worldClamp} = gameStore.state.tv;

        elementsDrawn.nr = 0;

        console.log(worldClamp.x2, worldClamp.y2);

        for (let y = 0; y < levelMap.length; y++) {
            if (y > worldClamp.y - 1 && y <= worldClamp.y2) {
                for (let x = 0; x < noEmptyX[y].length; x++) {
                    // if (x > worldClamp.x - 1) {
                    // console.log(worldClamp.y);
                    switch (levelMap[y][noEmptyX[y][x]]) {
                        case 'X':
                            gameStore.state.tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, color: 'red'});

                            elementsDrawn.nr++;
                            break;
                        case 'T':
                            gameStore.state.tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, color: 'blue'});

                            elementsDrawn.nr++;
                            break;
                        default:
                            break;
                    }
                    // }
                }
            }
        }
    };

    return {
        map: levelMap,
        width: levelMap[0].length,
        height: levelMap.length,
        playerStart: getPlayerStart(levelMap),
        show,
    };
};

export const getPlayerStart = (levelMap: Level) => {
    for (let y = 0; y < levelMap.length; y++) {
        const playerX = levelMap[y].indexOf('S');

        if (playerX !== -1) return vector(playerX, y);
    }

    throw new Error('start position for player not found in level map');
};
