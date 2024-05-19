/* eslint-disable no-param-reassign */
import {getCoinMap, getLevelMap} from './levels';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {LevelMap, MapElement} from 'games/tombraid/types/level';
import type {PaintMethods, StrokeRect, TransformedView} from 'games/library/types/tv';

const getEmptyXFromRow = (levelMapRow: MapElement[], emptiesRow: number[], count = 0) => {
    // This works only if right side ends with no '.' or 'S'
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

type Block = StrokeRect & {
    type: keyof PaintMethods;
};

type BlockMap = Block[][];

const createShow = (levelMap: LevelMap, blockMap: BlockMap, tv: TransformedView) => {
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
                    const blockType = blockMap[y][noEmptyX[y][x]].type;
                    if (blockType === 'strokeRect') tv.strokeRect(blockMap[y][noEmptyX[y][x]]);
                }
                // replace switch with an object
                // switch (levelMap[y][noEmptyX[y][x]]) {
                //     case 'X':
                //         tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, stroke: 'red', lw: 1});

                //         elementsDrawn.nr++;
                //         break;
                //     case 'C':
                //         tv.strokeRect({x: noEmptyX[y][x], y, w: 1, h: 1, stroke: 'blue', lw: 1});

                //         elementsDrawn.nr++;
                //         break;
                //     default:
                //         break;
                // }
            }
        }
    };
};

export const blocks = {
    '.': () => ({
        type: 'strokeRect',
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        lw: 0,
        stroke: 'purple',
    }),
    S: () => ({
        type: 'strokeRect',
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        stroke: 'orange',
        lw: 0,
    }),
    X: (x: number, y: number) => ({
        type: 'strokeRect',
        x,
        y,
        w: 1,
        h: 1,
        lw: 1,
        stroke: 'blue',
    }),
    C: (x: number, y: number) => ({
        // type: 'fillRect',
        type: 'strokeRect',
        x,
        y,
        w: 1,
        h: 1,
        // fill: 'green',
        stroke: 'green',
        lw: 1,
    }),
};

const getBlockMap = (levelMap: LevelMap) => {
    const blockMap: BlockMap = [];
    for (let y = 0; y < levelMap.length; y++) {
        blockMap.push([]);
        for (let x = 0; x < levelMap[y].length; x++) blockMap[y].push(blocks[levelMap[y][x]](x, y));
    }

    return blockMap;
};

export const getLevel = (id: number) => {
    const levelMap = getLevelMap(id);
    const coinMap = getCoinMap(id);
    const blockMap = getBlockMap(levelMap);

    console.log(blockMap);

    return {
        map: levelMap,
        blocks: blockMap,
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
