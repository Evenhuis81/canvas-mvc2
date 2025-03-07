import type {Circle, Fill, Pos, Rect, Stroke, Text} from 'library/types/shapes';
import type {Engine} from 'library/types/engine';
import {createEntity} from '.';

const defaultSketches: DefaultSketches = {
    text: {
        x: 0,
        y: 0,
        text: 'Entity Text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
    },
    rect: {
        x: 100,
        y: 50,
        w: 80,
        h: 40,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 2,
    },
    circle: {
        x: 100,
        y: 50,
        radius: 255,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 2,
    },
};

type DefaultSketches = {
    text: Text & Pos;
    rect: Rect & Fill & Stroke;
    circle: Circle & Fill & Stroke;
};

let textAdjust = 1.5;

const defaultSketchAndDraw: {
    [K in keyof DefaultSketches]: (c: CanvasRenderingContext2D) => {draw: () => void; sketch: DefaultSketches[K]};
} = {
    text: c => {
        const sketch = defaultSketches['text'];

        const draw = () => {
            c.fillStyle = sketch.textFill;
            c.font = `${sketch.fontSize}px ${sketch.font}`;
            c.textAlign = sketch.textAlign;
            c.textBaseline = sketch.textBaseLine;

            c.beginPath();
            c.fillText(sketch.text, sketch.x, sketch.y + textAdjust);
        };

        return {draw, sketch};
    },
    rect: c => {
        const sketch = defaultSketches['rect'];

        const draw = () => {
            c.fillStyle = sketch.fill;
            c.strokeStyle = sketch.stroke;

            c.beginPath();
            c.rect(sketch.x, sketch.y, sketch.w, sketch.h);
            c.fill();
            c.stroke();
        };

        return {draw, sketch};
    },
    circle: c => {
        const sketch = defaultSketches['circle'];

        const draw = () => {
            c.fillStyle = sketch.fill;
            c.strokeStyle = sketch.stroke;

            c.beginPath();
            c.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
            c.fill();
            c.stroke();
        };

        return {draw, sketch};
    },
};

export const entitySketches = (context: CanvasRenderingContext2D, engine: Engine) => {
    // const drawAndSketch = <T extends keyof DefaultSketches>(type: T, context: CanvasRenderingContext2D): {draw: () => void; sketch: DefaultSketches[T]} => {
    const createSketchAndDraw = <T extends keyof DefaultSketches>(
        type: T,
    ): {draw: () => void; sketch: DefaultSketches[T]} => {
        return defaultSketchAndDraw[type](context);
    };
    // {draw: () => void; sketch: Sketches[T]}

    // const returnObj = {
    //     draw: () => {},
    //     sketch: defaultSketches[type],
    // }

    // const returnObj = defaultSketchAndDraw[type](context);

    // return returnObj;
    // };

    const entity = createEntity<{
        [K in keyof DefaultSketches]: (c: CanvasRenderingContext2D) => {draw: () => void; sketch: DefaultSketches[K]};
    }>(context, engine, createSketchAndDraw);

    entity.create();

    // const cc = entity.create('text');
    // const createDraw = <T extends string>(type: T) => {
    //     //
    // };
    // entity.create('text', {textFill: '#00f'});
};
