import {RGBA} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle1: EntityCircle1;
    rect1: EntityRectangle1;
};

export type EntityShapeMapReturn = {
    button1: EntityButton1 & {colors: EntityColors['button1']};
    circle1: EntityCircle1 & {colors: EntityColors['circle1']};
    rect1: EntityRectangle1 & {colors: EntityColors['rect1']};
};

export type SketchColor = 'fill' | 'stroke' | 'textFill';

export type EntityRectangle1 = Rect & Fill & Stroke & {shapeType: 'rect'; sketchType: 'rect1'};

export type EntityCircle1 = Circle & Fill & Stroke & {shapeType: 'circle'; sketchType: 'circle1'};

export type EntityButton1 = Omit<EntityRectangle1, 'sketchType'> & Text & {radii: number; sketchType: 'button1'};

// type SketchColors<T extends keyof EntityColors> = {
//     [K in T]: {[U in keyof EntityColors[K]]: EntityColors[K][U]};
// };

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
