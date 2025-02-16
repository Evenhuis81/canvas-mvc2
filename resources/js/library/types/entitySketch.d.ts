import {RGBA} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle1: EntityCircle1;
    rect1: EntityRectangle1;
};

export type EntityShapeMapReturn<T extends keyof EntityShapeMap> = {
    [K in T]: EntityShapeMap[K] & {colors: EntityColors[K]};
};

export type SketchColor = 'fill' | 'stroke' | 'textFill';

export type EntityRectangle1 = Rect & Fill & Stroke & {type: 'rect1'};

export type EntityCircle1 = Circle & Fill & Stroke & {type: 'circle1'};

export type EntityButton1 = Rect & Fill & Stroke & Text & {radii: number} & {type: 'button1'};

export type EntityColorStrings = {
    button1: {
        fill: string;
        stroke: string;
        textFill: string;
    };
    circle1: {
        fill: string;
        stroke: string;
    };
    rect1: {
        fill: string;
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
