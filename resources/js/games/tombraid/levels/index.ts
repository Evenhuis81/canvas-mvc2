/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-param-reassign */
import {TransformedView} from 'library/types/views';
import {getCoinMap, getLevelMap} from './levels';
import {vector} from 'library/vector';
import type {CoinMap, LevelMap, MapElement} from 'games/tombraid/types/level';
// import {statistics} from '..';

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

const createMapShow = (
    levelMap: LevelMap,
    coinMap: CoinMap,
    tv: TransformedView,
    screenWidth: number,
    screenHeight: number,
) => {
    const elementsDrawn = {nr: 0};
    let alpha = 0;
    let alphaVel = 0.005;
    let alphaActive = true;

    // statistics.state.setFn(() => `elementsDrawn: ${elementsDrawn.nr}`);

    const noEmptyX = getEmptyX(levelMap);

    // eslint-disable-next-line complexity
    return {
        id: 4,
        name: 'level',
        fn: () => {
            alpha += alphaVel;

            if (alpha > 1) {
                alpha = 1;
                // alphaVel *= -1;
                alphaVel = 0;

                alphaActive = false;
            } else if (alpha < 0) {
                alpha = 0;
                alphaVel *= -1;
            }

            // Make this part of the tv/engine update
            tv.setWorldView(0, 0, screenWidth, screenHeight);
            elementsDrawn.nr = 0;

            for (let y = 0; y < levelMap.length; y++) {
                if (y > tv.worldView.y - 1 && y <= tv.worldView.y2) {
                    for (let x = 0; x < noEmptyX[y].length; x++) {
                        switch (levelMap[y][noEmptyX[y][x]]) {
                            case 'X':
                                tv.strokeRect({
                                    x: noEmptyX[y][x],
                                    y,
                                    w: 1,
                                    h: 1,
                                    stroke: `rgba(255, 255, 255, ${alpha})`,
                                    lw: tv.unitWeight.x,
                                });

                                elementsDrawn.nr++;
                                break;
                            case 'T':
                                tv.text({
                                    x: noEmptyX[y][x] + 0.5,
                                    y: y + 0.5,
                                    fill: '#fff',
                                    txt: 'T',
                                    fontSize: 24 * tv.unitWeight.x,
                                });
                                break;
                            case 'C': // for now C stand for cannon to the right
                                // put this in a wireframemodel (for rotation)
                                tv.line({
                                    x: noEmptyX[y][x],
                                    y: y + 0.5,
                                    x2: noEmptyX[y][x] + 1,
                                    y2: y + 0.5,
                                    stroke: '#00f',
                                    lw: 5,
                                });
                                tv.line({
                                    x: noEmptyX[y][x] + 1,
                                    y: y + 0.5,
                                    x2: noEmptyX[y][x] + 0.5,
                                    y2: y + 0.8,
                                    stroke: '#00f',
                                    lw: 5,
                                });
                                tv.line({
                                    x: noEmptyX[y][x] + 1,
                                    y: y + 0.5,
                                    x2: noEmptyX[y][x] + 0.5,
                                    y2: y + 0.2,
                                    stroke: '#00f',
                                    lw: 5,
                                });

                                elementsDrawn.nr++;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }

            // for (let y = 0; y < coinMap.length; y++) {
            //     for (let x = 0; x < coinMap[y].length; x++)
            //         tv.fillCircle({x: coinMap[y][x] + 0.5, y: y + 0.5, r: 0.1, fill: 'yellow'});
            // }
        },
    };
};

export const getLevel = (id: number) => {
    const levelMap = getLevelMap(id);
    // coin could also be a character on the map and this can be switched out (ie lamba functions from javid9x)
    const coinMap = getCoinMap(id);

    // const blockMap = getBlockMap(id);

    return {
        map: levelMap,
        // blockMap,
        width: levelMap[0].length,
        height: levelMap.length,
        playerStart: getPlayerStart(levelMap),
        createShow: createMapShow, // Map + Coins (separate?)
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

// type Bullet = {
//     x: number;
//     y: number;
//     vX: number;
//     vY: number;
// };

// type Cannon = {
//     x: number;
//     y: number;
//     direction: 'up' | 'down' | 'left' | 'right';
// };

// const getCannons = (map: LevelMap) => {
//     const cannons: Cannon[] = [];
//     for (let y = 0; y < map.length; y++)
//         for (let x = 0; x < map.length; x++) if map[y][x] === 'C') cannons.push({x, y, direction: 'right'});

//     return cannons;
// };
