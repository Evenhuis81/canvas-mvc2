/* eslint-disable no-param-reassign */
import {getCoinMap, getLevelMap} from './levels';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {LevelMap, MapElement} from 'games/tombraid/types/level';
import type {TransformedView} from 'games/library/types/tv';

const getEmptyXFromRow = (levelMapRow: MapElement[], emptiesRow: number[], count = 0) => {
    while (levelMapRow[count] === '.' || levelMapRow[count] === 'S') count++;

    emptiesRow.push(count);

    if (++count === levelMapRow.length) return;

    getEmptyXFromRow(levelMapRow, emptiesRow, count);
};

const getEmptyX = (levelMap: LevelMap) => {
    const empties: number[][] = [];

    for (let y = 0; y < levelMap.length; y++) {
        empties.push([]);

        getEmptyXFromRow(levelMap[y], empties[y]);
    }

    return empties;
};

const createShow = (levelMap: LevelMap, tv: TransformedView) => {
    // TODO::Make this optional or make it an option (goes for all statistic elements)
    const elementsDrawn = {nr: 0};
    setStatistic(() => `elements drawn: ${elementsDrawn.nr}`);

    const noEmptyX = getEmptyX(levelMap);

    // eslint-disable-next-line complexity
    return () => {
        elementsDrawn.nr = 0;

        for (let y = 0; y < levelMap.length; y++) {
            if (y > tv.worldClamp.y - 1 && y <= tv.worldClamp.y2) {
                for (let x = 0; x < noEmptyX[y].length; x++) {
                    // replace switch with an object
                    switch (levelMap[y][noEmptyX[y][x]]) {
                        case 'X':
                            tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, stroke: 'red', lw: 1});

                            elementsDrawn.nr++;
                            break;
                        case 'T':
                            tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, stroke: 'blue', lw: 1});

                            elementsDrawn.nr++;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };
};

export const getLevel = (id: number) => {
    const levelMap = getLevelMap(id);
    const coinMap = getCoinMap(id);

    return {
        map: levelMap,
        width: levelMap[0].length,
        height: levelMap.length,
        playerStart: getPlayerStart(levelMap),
        createShow,
        coins: coinMap,
    };
};

export const getPlayerStart = (levelMap: LevelMap) => {
    for (let y = 0; y < levelMap.length; y++) {
        const playerX = levelMap[y].indexOf('S');

        if (playerX !== -1) return vector(playerX, y);
    }

    throw new Error('start position "S" for player not found in level map');
};
