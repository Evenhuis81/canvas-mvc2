import {vector} from 'library/vector';
import {getLevel} from '../levels';
import {getPlayer} from '../player';
import {resources} from 'library/index';
import {levelResource} from '../menu';

export const startLevel = (lvlResourceID: string | number, resourceID: string | number) => {
    createStartLevel(levelResource[lvlResourceID], resources[resourceID]);
};

export const onResize = (
    engine: Engine,
    canvas: HTMLCanvasElement,
    tv: TransformedView,
    player: TRPlayer,
    level: LevelResource,
) => {
    engine.removeDraw(4);

    const scale = canvas.width / 24;

    const unitLength = 1 / scale;
    tv.setUnitWeight({x: unitLength, y: unitLength});

    tv.setScale(vector(scale, scale));
    tv.setScreenSize(vector(canvas.width, canvas.height));
    tv.setMiddle(vector(player.middlePos.x, player.middlePos.y));

    const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setDraw(levelShow);
};

const createStartLevel = (level: LevelResource, resources: Resources) => (levelNr: number) => {
    const level = getLevel(levelNr);

    const {tv, canvas, engine} = resources;

    const player = getPlayer(level.playerStart);

    const scale = canvas.width / 24;

    tv.setUnitWeight({x: 1 / scale, y: 1 / scale});

    tv.setScale(vector(scale, scale));
    tv.setScreenSize(vector(canvas.width, canvas.height));

    player.setPosition(level.playerStart);

    tv.setMiddle(vector(level.playerStart.x + 0.5, level.playerStart.y + 0.5));

    const levelDraw = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setDraw(levelDraw);
    engine.setDraw(player.show);

    engine.setUpdate(player.update);
};
