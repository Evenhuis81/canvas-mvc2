import {initialize} from 'library/index';
import {createCharacter} from './character';
import {createLevel} from './level';
import {CreateElement} from 'library/entity';
import {ShapeMap} from 'library/entity/defaults/shapes';
import {Engine} from 'library/types/engine';
import {level1} from './level1';

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

    const {update: levelUpdate, draw: levelDraw} = createLevel(context, world);

    engine.setUpdate({fn: levelUpdate});
    engine.setUpdate(charUpdate);

    engine.setDraw({fn: levelDraw});
    engine.setDraw(charDraw);

    showStats(charProps, world, entity.create, engine);

    library.runEngine();
};

const showStats = (
    charProps: {scaledW: number; scaledH: number; scaledX: number; scaledY: number; pos: {x: number; y: number}},
    world: WorldProperties,
    createElement: CreateElement<ShapeMap>,
    engine: Engine,
) => {
    const cc = createElement('circle', {
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2,
        r: 5,
        fill: '#f66',
    });

    const tt = createElement('text', {
        text: `scaledX: ${charProps.scaledX}, scaledY: ${charProps.scaledY}`,
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2,
        textAlign: 'end',
        textBaseLine: 'top',
    });

    const tt2 = createElement('text', {
        text: `X: ${charProps.pos.x}, Y: ${charProps.pos.y}`,
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2 + 15,
        textAlign: 'end',
        textBaseLine: 'top',
    });

    const tt3 = createElement('text', {
        text: `levelCharacter: ${level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x)]}`,
        x: charProps.scaledX + charProps.scaledW / 2,
        y: charProps.scaledY + charProps.scaledH / 2 - 15,
        textAlign: 'end',
        textBaseLine: 'top',
    });

    const ttE = createElement('text', {text: `levelOffset: ${levelOffset.x.toFixed(2)}`, textAlign: 'start'});

    const testArr: number[][] = [[1]];

    console.log(testArr[Math.floor(0.2)][0]);

    engine.setUpdate({
        fn: () => {
            tt.sketch.text = `scaledX: ${charProps.scaledX.toFixed(2)}, scaledY: ${charProps.scaledY.toFixed(2)}`;
            ttE.sketch.text = `levelOffset: ${levelOffset.x.toFixed(2)}`;
            tt2.sketch.text = `X: ${charProps.pos.x.toFixed(1)}, Y: ${charProps.pos.y.toFixed(1)}`;
            // tt3.sketch.text = `levelCharacter: ${
            //     level1[Math.floor(charProps.pos.y)][Math.floor(charProps.pos.x + levelOffset.x)]
            // }`;
            tt3.sketch.text = `worldXoffset: ${world.xOffset}`;
            cc.sketch.x = charProps.scaledX;
            cc.sketch.y = charProps.scaledY;
            tt.sketch.x = charProps.scaledX;
            tt.sketch.y = charProps.scaledY;
            tt2.sketch.x = charProps.scaledX;
            tt2.sketch.y = charProps.scaledY + 15;
            tt3.sketch.x = charProps.scaledX;
            tt3.sketch.y = charProps.scaledY - 15;
        },
    });

    cc.show();
    tt.show();
    tt2.show();
    tt3.show();
    ttE.show();
};
