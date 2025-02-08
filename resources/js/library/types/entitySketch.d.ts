import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    entityRect: EntityRect;
    entityCircle: EntityCircle;
    b1: EntityB1;
};

export type EntityRect = Rect & Fill & Stroke;

export type EntityCircle = Circle & Fill & Stroke;

export type EntityB1 = EntityRect & Text & {radii: number};
