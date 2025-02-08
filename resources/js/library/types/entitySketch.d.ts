import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    entityRect: EntityRect;
    entityCircle: EntityCircle;
    b1: EntityB1;
};

export type EntityShapeMapInternal = {
    [K in keyof EntityShapeMap]: EntityShapeMap & {type: K};
};

export type EntityRect = Rect & Fill & Stroke & {type: 'rect'};

export type EntityCircle = Circle & Fill & Stroke & {type: 'circle'};

export type EntityB1 = EntityRect & Text & {radii: number; type: 'rect'};
