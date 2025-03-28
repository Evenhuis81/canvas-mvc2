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

const defaultOptions = {
    scale: 10,
    lineWidth: 2,
    fillStyle: 'white',
};

export const getLevelRaster = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    options = defaultOptions,
) => {
    const {scale} = options;

    const draw = () => {
        ctx.beginPath();
        ctx.fillStyle = options.fillStyle;
        ctx.lineWidth = options.lineWidth;

        for (let y = 0; y < height + 1; y++) {
            ctx.moveTo(0, y * scale);
            ctx.lineTo(width * scale, y * scale);

            for (let x = 0; x < width + 1; x++) {
                ctx.moveTo(x * scale, 0);
                ctx.lineTo(x * scale, height * scale);
            }

            ctx.stroke();
        }
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
