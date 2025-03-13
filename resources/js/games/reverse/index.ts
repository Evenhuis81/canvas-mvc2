import {initialize} from 'library/index';
import {createCharacter} from './character';
import {createLevel} from './level';

const libraryID = 'reverse';

const libraryOptions = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

export type WorldProperties = {
    unitsX: number;
    unitsY: number;
    xOffset: number;
    yOffset: number;
    xMargin: number;
    yMargin: number;
    unitScale: number; // unitLength & unitHeight is the same
    display: 'portrait' | 'landscape';
};

const world: WorldProperties = {
    unitsX: 16,
    unitsY: 9,
    xOffset: 0,
    yOffset: 0,
    xMargin: 0,
    yMargin: 0,
    unitScale: 0,
    display: 'portrait',
};

const setScreen = (canvas: HTMLCanvasElement) => {
    world.unitScale = canvas.width / world.unitsX / 2;

    if (canvas.width > canvas.height) {
        world.display = 'portrait';

        world.yMargin = (canvas.height - world.unitScale * world.unitsY) / 2;

        return;
    }

    world.display = 'landscape';

    world.xMargin = (canvas.width - world.unitScale * 16) / 2;
};

export default () => {
    const library = initialize(libraryID, libraryOptions);
    const {canvas, context, engine, entity} = library;

    const cc = entity.create('circle');
    const rr = entity.create('rect');
    const cc2 = entity.create('circle', {x: 400, y: 110, r: 5, fill: '#f66'});
    const tt = entity.create('text');

    cc.show();
    cc2.show();
    rr.show();
    tt.show();

    setScreen(canvas);

    const {draw: charDraw, update: charUpdate, char: charProps} = createCharacter(libraryID, world, context, canvas);

    const {update: levelUpdate, draw: levelDraw, levelOffset} = createLevel(context, world);

    engine.setUpdate({fn: levelUpdate});
    engine.setDraw({fn: levelDraw});

    engine.setUpdate(charUpdate);
    engine.setDraw(charDraw);

    engine.setUpdate({
        fn: () => {
            tt.sketch.shape.text = levelOffset.x.toFixed(2).toString();
        },
    });

    // const text1 = {
    //     pos: charProps.pos,
    //     text: 'Test',
    // };

    library.runEngine();
};
