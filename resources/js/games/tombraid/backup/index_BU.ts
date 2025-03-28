/* eslint-disable max-lines-per-function */
// import {gameStore} from './store';
// import {getCanvas, getContext2D} from 'library/canvas';
// import {getEngine} from 'library/engine';
// import {enableStatistics} from 'library/statistics';
// import {getTV} from 'games/library/transformedView';
// import {setMouseInput} from 'games/library/input';

import {getLevel} from '../levels';

// const goToMenu = (
// context: CanvasRenderingContext2D,
// engine: Engine,
// tv: TransformedView,
// canvas: HTMLCanvasElement,
// ) => {
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

// const button = getButton(buttonObj);

// const startButton = getStartButton(context);
// engine.setDraw(startButton.show);

// addEventListener('mouseup', () => {
//     if (startButton.inside()) startLevel(2, tv, context, canvas, engine);
// });
// };

// export default {
//     setup: () => {
//         const canvas = getCanvas();
//         const context = getContext2D(canvas);
//         const engine = getEngine();
//         const tv = getTV(context);

//         // Make globally available
//         gameStore.set({canvas, context, engine, tv});
//         setMouseInput(canvas);

//         // Engine Updates
//         const clearScreen = {
//             id: 0,
//             name: 'clear screen',
//             fn: () => context.clearRect(0, 0, canvas.width, canvas.height),
//         };

//         engine.setUpdate(clearScreen);

//         const tvUpdate = tv.createTVUpdateSetWorldClamp(canvas);
//         engine.setUpdate(tvUpdate);

// Menu Screen
// goToMenu(context, engine, tv, canvas);

// Engine Shows
// engine.setDraw(s);

// await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

// const startLevel = (
//     levelNr: number,
//     tv: TransformedView,
//     context: CanvasRenderingContext2D,
//     canvas: HTMLCanvasElement,
//     engine: Engine,
// ) => {
//     const level = getLevel(levelNr);
//     levelStore.set(level);
//     tv.setScale(vector(context.canvas.width / 13, canvas.height / 13));
//     tv.setScaleFactor(0.99);
//     tv.setScreenSize(vector(context.canvas.width, context.canvas.height));
//     tv.setWorldBorders(vector2(0, 0, level.width, level.height));
//     tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
//     const player = getPlayer(level.playerStart);
//     playerStore.set(player);
//     // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
//     engine.setUpdate(player.update);
//     // when a component use the gamestore, make create functions so they can be used at a later point
//     const levelShow = level.createShow(level.map, level.coins, tv);
//     engine.setDraw(levelShow);
//     engine.setDraw(player.show);

//     engine.showsOverview();
//     engine.updatesOverview();
// };

// const startLevel = (levelNr: number) => {
//     const level = getLevel(levelNr);

getLevel;

//     levelStore.set(level);

//     const {tv, canvas, engine} = resources.state;
//     const player = playerStore.state;

//     const scale = canvas.width / 24;

//     tv.setUnitWeight({x: 1 / scale, y: 1 / scale});

//     tv.setScale(vector(scale, scale));
//     tv.setScreenSize(vector(canvas.width, canvas.height));

//     player.setPosition(level.playerStart);

//     tv.setMiddle(vector(level.playerStart.x + 0.5, level.playerStart.y + 0.5));

//     const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

//     engine.setDraw(levelShow);
//     engine.setDraw(player.show);

//     engine.setUpdate(player.update);

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

// const tvUpdate = tv.createTVUpdateSetWorldClamp(canvas);
// engine.setUpdate(tvUpdate);

// import {enableStatistics} from 'library/statistics';
// import {getTV} from 'games/library/transformedView';
// enableStatistics();

// statistics.state.set({
//     id: 8,
//     name: 'player (middle) pos',
//     fn: () => `player.x: ${player.middlePos.x}, player.y: ${player.middlePos.y}`,
// });

// statistics.state.setFn(() => `${tv.scale.x}`);
// };

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
