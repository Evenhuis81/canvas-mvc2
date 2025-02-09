import {Colors} from './color';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    entityRect: EntityRect;
    entityCircle: EntityCircle;
    b1: EntityB1;
};

export type EntitySketchReturn<T extends keyof EntityShapeMap> = {
    [K in T]: EntityShapeMap[K] & {colors: Colors};
};

export type EntityRect = Rect & Fill & Stroke & {type: 'rect'};

export type EntityCircle = Circle & Fill & Stroke & {type: 'circle'};

export type EntityB1 = EntityRect & Text & {radii: number};
