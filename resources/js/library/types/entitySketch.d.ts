import {RGBA} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle1: EntityCircle1;
    rect1: EntityRectangle1;
};

// export type EntitySketchMap<T extends keyof EntityShapeMap> = {
//     [K in T]: EntityShapeMap[K] & EntityColors[K];
// };

export type EntitySketchMap = {
    //
};

export type EntityRectangle1 = Rect & Fill & Stroke & {inputType: 'rect'; type: 'rect1'};

export type EntityCircle1 = Circle & Fill & Stroke & {inputType: 'circle'; type: 'circle1'};

export type EntityButton1 = EntityRectangle1 & Text & {radii: number; type: 'button1'}; // inputType inherit ('rect')

// TODO::Mrege this with SV / TV sketches / shapes
export type EntityColorString = {
    button: {
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
    text: {
        textFill: string;
    };
    line: {
        stroke: string;
    };
};

export type EntityColors = {
    button1: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
        // type: 'rectColors';
    };
    circle1: {
        fill: RGBA;
        stroke: RGBA;
        // type: 'circleColors';
    };
    rect1: {
        fill: RGBA;
        stroke: RGBA;
        // type: 'rectColors';
    };
};
