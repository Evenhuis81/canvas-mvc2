import {vector} from 'library/vector';
import {getLevel} from '../levels';
import {getPlayer} from '../player';
import {resources} from 'library/index';

// const levelResource: Record<number, TRLevel> = {};
// const playerResource: Record<number, TRPlayer> = {};

export const startLevel = (levelNr: number) => {
    const {tv, canvas, engine} = resources.tr;

    // All things level related
    const level = getLevel(levelNr);
    const levelDraw = level.createDraw(level.map, level.coins, tv, canvas.width, canvas.height);
    engine.setDraw(levelDraw);

    // All things tv related
    const scale = canvas.width / 24;
    tv.setUnitWeight({x: 1 / scale, y: 1 / scale});
    tv.setScale(vector(scale, scale));
    tv.setScreenSize(vector(canvas.width, canvas.height));
    // Needs level
    tv.setMiddle(vector(level.playerStart.x + 0.5, level.playerStart.y + 0.5));

    // All things player related
    const player = getPlayer();
    player.setPosition(level.playerStart);
    const playerUpdate = player.createUpdate(tv, level.map);
    const playerDraw = player.createDrawCircle(tv);
    engine.setDraw(playerDraw);
    engine.setUpdate(playerUpdate);
};

export const onResize = (
    engine: Engine,
    canvas: HTMLCanvasElement,
    tv: TransformedView,
    player: TRPlayer,
    level: TRLevel,
) => {
    engine.removeDraw(4);

    const scale = canvas.width / 24;

    const unitLength = 1 / scale;
    tv.setUnitWeight({x: unitLength, y: unitLength});

    tv.setScale(vector(scale, scale));
    tv.setScreenSize(vector(canvas.width, canvas.height));
    tv.setMiddle(vector(player.middlePos.x, player.middlePos.y));

    const levelDraw = level.createDraw(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setDraw(levelDraw);
};
