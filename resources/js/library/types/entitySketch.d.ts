import {RGBA} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    button1: EntityButton1;
    circle1: EntityCircle1;
    rect1: EntityRectangle1;
    // button1: EntityButton1 & {sketchType: 'button1'};
    // circle1: EntityCircle1 & {sketchType: 'circle1'};
    // rect1: EntityRectangle1 & {sketchType: 'rect1'};
};

export type SketchColor = 'fill' | 'stroke' | 'textFill';

export type SketchInternalType = 'rect1' | 'circle1' | 'button';

type SketchColors<T extends keyof EntityColors> = {
    [K in T]: {[U in keyof EntityColors[K]]: EntityColors[K][U]};
};

export type EntityRectangle1 = Rect & Fill & Stroke & {type: 'rect'; sketchType: 'rect1'};

export type EntityCircle1 = Circle & Fill & Stroke & {type: 'circle'; sketchType: 'circle1'};

export type EntityButton1 = Omit<EntityRectangle1, 'sketchType'> & Text & {radii: number; sketchType: 'button'};

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
