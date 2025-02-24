import {RGBA} from './color';
import {Circle, Fill, Line, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle: EntityCircle1;
    rect: EntityRectangle1;
    line: EntityLine1;
    text: EntityText1;
};

export type EntitySketchMap = {
    button1: EntityShapeMap['button1'] & {color: EntityColor['button1']};
    circle: EntityShapeMap['circle'] & {color: EntityColor['circle']};
    rect: EntityShapeMap['rect'] & {color: EntityColor['rect']};
    line: EntityShapeMap['line'] & {color: EntityColor['line']};
    text: EntityShapeMap['text'] & {color: EntityColor['text']};
};

export type EntityRectangle1 = Rect & Fill & Stroke & {inputType: 'rect'; type: 'rect'};

export type EntityCircle1 = Circle & Fill & Stroke & {inputType: 'circle'; type: 'circle'};

export type EntityLine1 = Line & Stroke & {inputType: 'none'; type: 'line'};

export type EntityText1 = Text & {inputType: 'none'; type: 'text'};

export type EntityButton1 = Omit<EntityRectangle1, 'type'> & Text & {radii: number; type: 'button1'}; // inputType inherit ('rect')

// TODO::Mrege this with SV / TV sketches / shapes
export type EntityColorString = {
    button1: {
        fill: string;
        stroke: string;
    };
    circle: {
        fill: string;
        stroke: string;
    };
    rect: {
        fill: string;
        stroke: string;
    };
    line: {
        stroke: string;
    };
    text: {
        textFill: string;
    };
};

export type EntityColor = {
    button1: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
    };
    circle: {
        fill: RGBA;
        stroke: RGBA;
    };
    rect: {
        fill: RGBA;
        stroke: RGBA;
    };
    line: {
        stroke: RGBA;
    };
    text: {
        textFill: RGBA;
    };
};
