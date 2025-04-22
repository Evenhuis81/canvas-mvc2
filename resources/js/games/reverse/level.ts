import type {TransformedView} from 'library/types/views';
import type {WorldProperties} from '.';
import {levels} from './levelMap';

type RawLevelMap = string[][];

type LevelMap = Tile[][];

type Tile = EmptyTile | SolidTile;

type EmptyTile = {
    type: 'empty';
};

type SolidTile = {
    type: 'solid';
};

export type ReverseLevel = {
    id: number;
    rawMap: RawLevelMap;
    map: LevelMap;
    tilesX: number;
    tilesY: number;
    visibleTilesX: number;
    visibleTilesY: number;
    getRawTile: (x: number, y: number) => string;
    setRawTile: (x: number, y: number, tile: string) => void;
    startPos: (rawLevelMap: RawLevelMap) => {x: number; y: number};
};

const getLevelTiles = (rawLevelMap: RawLevelMap) => {
    //
};

export const getLevel = (levelID: number): ReverseLevel => {
    const rawLevelMap = levels[levelID];
    const level = getLevelTiles(rawLevel);

    return {
        id: levelID,
        rawMap: rawLevelMap,
        map: [
            [
                {
                    type: 'empty',
                },
            ],
        ],
        tilesX: rawLevelMap[0].length,
        tilesY: rawLevelMap.length,
        visibleTilesX: 12,
        visibleTilesY: rawLevelMap.length,
        getRawTile: (x, y) => {
            if (x >= 0 && x < rawLevelMap[0].length && y >= 0 && y < rawLevelMap.length) return rawLevelMap[y][x];

            return ' ';
        },
        setRawTile: (x, y, tileType) => {
            if (tileType.length != 1) return;

            if (x >= 0 && x < rawLevelMap[0].length && y >= 0 && y < rawLevelMap.length) rawLevelMap[y][x] = tileType;
        },
        startPos: getStartPos,
    };
};

export const createLevelDraw = (ctx: CanvasRenderingContext2D, tv: TransformedView, level: ReverseLevel) => ({
    id: level.id,
    name: `level${level.id}-draw`,
    fn: () => {
        const topLeft = tv.screen2World(0, 0);
        const bottomRight = tv.screen2World(ctx.canvas.width, ctx.canvas.height);

        for (let y = 0; y < level.tilesY; y++) {
            if (y > topLeft.yT && y < bottomRight.yT) {
                for (let x = 0; x < level.tilesX; x++) {
                    if (x > topLeft.xT && x < bottomRight.xT && level.rawMap[y][x] === 'X')
                        tv.paint.roundRectStroke(x, y, 0.6, 0.6, '#ccc', 0.02, 0.06);
                }
            }
        }
    },
});

const getStartPos = (levelMap: RawLevelMap) => {
    let x = -1;
    let y = -1;

    y = levelMap.findIndex(levelY => {
        const iX = levelY.findIndex(levelX => levelX === 'S');

        x = iX;

        return iX !== -1;
    });

    return {x, y};
};
