// import {Colors, RGBA} from './color';
import {RGBA} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle1: EntityCircle1;
    rect1: EntityRectangle1;
};

// type SketchColor = 'fill' | 'stroke' | 'textFill';

type SketchColors<T extends keyof EntityColors> = {
    [K in T]: {[U in keyof EntityColors[K]]: EntityColors[K][U]};
};

export type EntityRectangle1 = Rect & Fill & Stroke & {type: 'rect'};

export type EntityCircle1 = Circle & Fill & Stroke & {type: 'circle'};

export type EntityButton1 = EntityRectangle1 & Text & {radii: number};

export type EntityColors = {
    button1: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
    };
    circle1: {
        fill: RGBA;
        stroke: RGBA;
    };
    rect1: {
        fill: RGBA;
        stroke: RGBA;
    };
};
