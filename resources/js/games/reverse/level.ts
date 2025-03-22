import {WorldProperties} from '.';
import {levels} from './levelMap';

type LevelMap = string[][];

export type ReverseLevel = {
    id: number;
    map: LevelMap;
    width: number;
    height: number;
    getTile: (x: number, y: number) => string;
    setTile: (x: number, y: number, levelCharacter: string) => void;
    startPos: (levelMap: LevelMap) => {x: number; y: number};
};

export const getLevel = (levelID: number): ReverseLevel => {
    const w = levels[levelID][0].length;
    const h = levels[levelID].length;

    const level = levels[levelID];

    console.log(level);

    return {
        id: levelID,
        map: levels[levelID],
        width: w,
        height: h,
        getTile: (x, y) => {
            if (x >= 0 && x < w && y >= 0 && y < h) return levels[levelID][y][x];

            return ' ';
        },
        setTile: (x, y, tileType) => {
            if (tileType.length != 1) return;

            if (x >= 0 && x < levels[levelID][0].length && y >= 0 && y < levels[levelID].length)
                levels[levelID][y][x] = tileType;
        },
        startPos: getStartPos,
    };
};

export const createLevelDraw = (ctx: CanvasRenderingContext2D, world: WorldProperties, level: ReverseLevel) => ({
    id: level.id,
    name: `level${level.id}-draw`,
    fn: () => {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                if (level.map[y][x] === 'X') {
                    ctx.beginPath();

                    ctx.roundRect(
                        (x + 0.2 + world.xOffset) * world.unitScale,
                        (y + 0.2 + world.yOffset) * world.unitScale,
                        world.unitScale * 0.6,
                        world.unitScale * 0.6,
                        3,
                    );

                    ctx.stroke();
                }
            }
        }
    },
});

const getStartPos = (levelMap: LevelMap) => {
    let x = -1;
    let y = -1;

    y = levelMap.findIndex(levelY => {
        const iX = levelY.findIndex(levelX => levelX === 'S');

        x = iX;

        return iX !== -1;
    });

    return {x, y};
};
