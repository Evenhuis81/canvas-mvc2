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

    setScreen(canvas);

    const {draw: charDraw, update: charUpdate, char: charProps} = createCharacter(libraryID, world, context, canvas);

    const {update: levelUpdate, draw: levelDraw, levelOffset} = createLevel(context, world);

    const cc = entity.create('circle', {
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2,
        r: 5,
        fill: '#f66',
    });

    const tt = entity.create('text', {
        text: `scaledX: ${charProps.scaledX}, scaledY: ${charProps.scaledY}`,
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2,
        textAlign: 'end',
        textBaseLine: 'top',
    });

    const tt2 = entity.create('text', {text: `levelOffset: ${levelOffset.x.toFixed(2)}`, textAlign: 'start'});

    engine.setUpdate({fn: levelUpdate});
    engine.setUpdate(charUpdate);
    engine.setUpdate({
        fn: () => {
            // tt.sketch.text = levelOffset.x.toFixed(2).toString();
            tt.sketch.text = `scaledX: ${charProps.scaledX.toFixed(2)}, scaledY: ${charProps.scaledY.toFixed(2)}`;
            tt2.sketch.text = `levelOffset: ${levelOffset.x.toFixed(2)}`;
            cc.sketch.x = charProps.scaledX + charProps.scaledW / 2;
            cc.sketch.y = charProps.scaledY + charProps.scaledH / 2;
            tt.sketch.x = charProps.scaledX + charProps.scaledW / 2;
            tt.sketch.y = charProps.scaledY + charProps.scaledH / 2;
        },
    });

    engine.setDraw({fn: levelDraw});
    engine.setDraw(charDraw);

    cc.show();
    tt.show();
    tt2.show();

    // const text1 = {
    //     pos: charProps.pos,
    //     text: 'Test',
    // };

    library.runEngine();
};
