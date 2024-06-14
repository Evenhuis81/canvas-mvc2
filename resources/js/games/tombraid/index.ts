import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';

export const trResources = createStore<ResourcesAndTV>();

export default {
    setup: () => {
        const {canvas, context, engine, tv} = initialize({withTV: true}, 'container');

        trResources.set({canvas, context, engine, tv});

        tv.setDefaults(context);

        // Make globally available
        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        options.setClear();
        options.setDot();

        const grid = tv.getGrid(context);

        // Engine Updates

        // Menu Screen
        // goToMenu();

        // Engine Shows
        engine.setShow(grid.show);

        // Make this a hidden option inside the canvas
        // enableStatistics();

        // StartLevel

        // engine.showsOverview();
        // engine.updatesOverview();
    },
    run: () => trResources.state.engine.run(),
    runOnce: () => trResources.state.engine.runOnce(),
};

// const goToMenu = () => {
// buttons:
// 1. start
// 2. settings
// 3. exit
// 4. admin options
// 5. show statistics
// 6. level editor
// 7. login
// 8. create account
// 9. load game
// 10. save game

// const startButton = getStartButton(resources.tr.context);
// resources.tr.engine.setShow(startButton.show);

//     addEventListener('mouseup', () => {
//         if (startButton.inside()) startLevel(2);
//         // console.log('startLevel {level nummer}');
//     });
// };

// const startLevel = (levelNr: number) => {
//     const level = getLevel(levelNr);

//     console.log(level);
//     //     levelStore.set(level);
//     tv.setScale(vector(context.canvas.width / 13, canvas.height / 13));
//     tv.setScaleFactor(0.99);
//     tv.setScreenSize(vector(context.canvas.width, context.canvas.height));
//     tv.setWorldBorders(vector2(0, 0, level.width, level.height));
//     tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
//     //     const player = getPlayer(level.playerStart);
//     //     playerStore.set(player);
//     //     // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
//     //     engine.setUpdate(player.update);
//     //     // when a component use the gamestore, make create functions so they can be used at a later point
//     //     const levelShow = level.createShow(level.map, level.coins, tv);
//     //     engine.setShow(levelShow);
//     //     engine.setShow(player.show);

//     //     engine.showsOverview();
//     //     engine.updatesOverview();
// };
