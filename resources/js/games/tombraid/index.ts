import {createStore} from 'library/store';
import {getLevel} from './levels';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
// import {getStartButton} from './button';
import {setMouseInput} from 'library/input';
import {vector} from 'library/vector';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';

export const resources = createStore<ResourcesAndTV>();
export const levelStore = createStore<LevelResource>();
export const playerStore = createStore<PlayerResource>();

export default {
    setup: () => {
        const {canvas, context, engine, tv} = initialize('container');

        resources.set({canvas, context, engine, tv});

        const player = getPlayer();
        playerStore.set(player);

        // Make globally available
        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        options.setClear();
        options.setDot();

        goToMenu(); // = start level directly for now
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

    // const startButton = getStartButton(resources.state.context);
    // resources.state.engine.setShow(startButton.show);

    // addEventListener('mouseup', () => {
    //     if (startButton.inside()) startLevel(2);
    // });

    startLevel(3);
};

const startLevel = (levelNr: number) => {
    const level = getLevel(levelNr);
    levelStore.set(level);

    const {tv, canvas, engine} = resources.state;
    const player = playerStore.state;
    const scale = canvas.width / 24;

    // Level used externally ?

    tv.setScale(vector(scale, scale));
    tv.setScaleFactor(0.99);
    tv.setScreenSize(vector(canvas.width, canvas.height));

    player.setPosition(level.playerStart);

    // const tvUpdate = tv.moveTo(player.middlePos);

    const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setShow(levelShow);
    engine.setShow(player.show);

    engine.setUpdate(player.update);
    engine.setUpdate(tvUpdate);
};
