import createEntity from 'library/entity';
import {getLevel} from './levels';
import {vector, vector2} from 'library/vector';
import {getPlayer} from './player';
import {resources} from 'library/index';

export const levelResource: Record<any, any> = {};
export const playerResource: Record<any, any> = {};

export const goToMenu = () => {
    const entity = createEntity('tr');

    entity.create({
        x: 80,
        y: 50,
        text: 'Start #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
        mouse: {
            up: () => {
                // if (startButton.inside()) startLevel(2, tv, context, canvas, engine);
            },
        },
        onEndEnd: () => {
            console.log('onEndEnd');
        },
    });

    // const tvUpdate = tv.createTVUpdateSetWorldClamp(canvas);
    // engine.setUpdate(tvUpdate);

    // import {enableStatistics} from 'library/statistics';
    // import {getTV} from 'games/library/transformedView';
    // enableStatistics();

    // const startLevel = (
    //     levelNr: number,
    //     tv: TransformedView,
    //     context: CanvasRenderingContext2D,
    //     canvas: HTMLCanvasElement,
    //     engine: Engine,
    // ) => {
    //     const level = getLevel(levelNr);
    //     levelResource.level = level;
    //     tv.setScale(vector(context.canvas.width / 13, canvas.height / 13));
    //     tv.setScaleFactor(0.99);
    //     tv.setScreenSize(vector(context.canvas.width, context.canvas.height));
    //     tv.setWorldBorders(vector2(0, 0, level.width, level.height));
    //     tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
    //     const player = getPlayer(level.playerStart);
    //     playerResource.player = player;
    //     // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
    //     engine.setUpdate(player.update);
    //     // when a component use the gamestore, make create functions so they can be used at a later point
    //     const levelShow = level.createShow(level.map, level.coins, tv, context.canvas.width, context.canvas.height);
    //     engine.setDraw(levelShow);
    //     engine.setDraw(player.show);
    // };

    const startLevel = (levelNr: number) => {
        const level = getLevel(levelNr);

        levelResource.level = level;

        const {tv, canvas, engine} = resources.tr;

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

    // onResize(() => {
    //     engine.removeDraw(4);

    //     const scale = canvas.width / 24;

    //     const unitLength = 1 / scale;
    //     tv.setUnitWeight({x: unitLength, y: unitLength});

    //     tv.setScale(vector(scale, scale));
    //     tv.setScreenSize(vector(canvas.width, canvas.height));
    //     tv.setMiddle(vector(player.middlePos.x, player.middlePos.y));

    //     const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    //     engine.setDraw(levelShow);
    // });

    // statistics.state.set({
    //     id: 8,
    //     name: 'player (middle) pos',
    //     fn: () => `player.x: ${player.middlePos.x}, player.y: ${player.middlePos.y}`,
    // });

    // statistics.state.setFn(() => `${tv.scale.x}`);
    // };
};
