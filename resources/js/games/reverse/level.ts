import {TransformedView} from 'library/types/views';
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

const raster = {
    lineWidth: 2,
    strokeStyle: '#fff',
};

export const getLevelRaster = (
    ctx: CanvasRenderingContext2D,
    tv: TransformedView,
    width: number,
    height: number,
    options = raster,
) => {
    const unitSize = ctx.canvas.width / 16; // 48.75
    const lW = 1 / unitSize;

    const draw = () => {
        ctx.strokeStyle = options.strokeStyle;
        ctx.lineWidth = lW * tv.scale.x;

        // console.log(tv.scale.x);

        ctx.beginPath();

        for (let y = 0; y < height + 1; y++) {
            tv.paint.line(0, y, width, y);

            for (let x = 0; x < width + 1; x++) {
                tv.paint.line(x, 0, x, height);
            }
        }

        ctx.stroke();
    };

    return {
        id: 'level-raster-draw',
        name: 'Level Raster Draw',
        fn: draw,
    };
};

export const getLevel = (levelID: number): ReverseLevel => {
    const level = levels[levelID];

    return {
        id: levelID,
        map: level,
        width: level[0].length,
        height: level.length,
        getTile: (x, y) => {
            if (x >= 0 && x < level[0].length && y >= 0 && y < level.length) return level[y][x];

            return ' ';
        },
        setTile: (x, y, tileType) => {
            if (tileType.length != 1) return;

            if (x >= 0 && x < level[0].length && y >= 0 && y < level.length) level[y][x] = tileType;
        },
        startPos: getStartPos,
    };
};

export const createLevelDraw = (
    ctx: CanvasRenderingContext2D,
    tv: TransformedView,
    world: WorldProperties,
    level: ReverseLevel,
) => ({
    id: level.id,
    name: `level${level.id}-draw`,
    fn: () => {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = tv.scale.x * (1 / world.xUnits);

        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                if (level.map[y][x] === 'X')
                    tv.paint.roundRectStroke(x + 0.2 + world.xOffset, y + 0.2 + world.yOffset, 0.6, 0.6, 3);
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
