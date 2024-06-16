import {createStore} from 'library/store';
import {getLevel} from './levels';
import {getLibraryOptions, initialize} from 'library/index';
import {getStartButton} from './button';
import {setMouseInput} from 'library/input';
import {vector, vector2} from 'library/vector';
import type {ResourcesAndTV} from 'library/types';

export const resources = createStore<ResourcesAndTV>();

export default {
    setup: () => {
        const {canvas, context, engine, tv} = initialize('container');

        resources.set({canvas, context, engine, tv});

        tv.setDefaults(context);

        // Make globally available
        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        options.setClear();
        options.setDot();

        goToMenu();
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const goToMenu = () => {
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

    const startButton = getStartButton(resources.state.context);
    resources.state.engine.setShow(startButton.show);

    addEventListener('mouseup', () => {
        if (startButton.inside()) startLevel(2);
        // console.log('startLevel {level nummer}');
    });
};

const startLevel = (levelNr: number) => {
    const level = getLevel(levelNr);
    const {tv, canvas, engine} = resources.state;
    const scale = canvas.width / 13;

    console.log(level);
    //     levelStore.set(level);
    tv.setScale(vector(scale, scale));
    tv.setScaleFactor(0.99);
    tv.setScreenSize(vector(canvas.width, canvas.height));
    tv.setWorldBorders(vector2(0, 0, level.width, level.height));
    tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));

    // const player = getPlayer(level.playerStart);
    // playerStore.set(player);

    // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
    //     engine.setUpdate(player.update);

    //     // when a component use the gamestore, make create functions so they can be used at a later point
    const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);
    engine.setShow(levelShow);
    //     engine.setShow(player.show);
};
