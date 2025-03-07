import {Circle, Fill, Pos, Rect, Stroke, Text} from 'library/types/shapes';
import {createEntity} from '.';
import {Engine} from 'library/types/engine';

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
export const defaultSketchAndDraw = {
    text: (c: CanvasRenderingContext2D) => () => {
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
    rect: (c: CanvasRenderingContext2D) => () => {
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
    circle: (c: CanvasRenderingContext2D) => () => {
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
    const drawAndSketch = <T extends keyof DefaultSketches>(
        type: T,
        context: CanvasRenderingContext2D,
    ) => {draw: () => void; sketch: Sketches[T]}

    const entity = createEntity<DefaultSketches>(context, engine, drawAndSketch);
    // const createDraw = <T extends string>(type: T) => {
    //     //
    // };
    // entity.create('text', {textFill: '#00f'});
};
