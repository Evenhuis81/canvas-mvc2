import {WithRequired} from '.';
import {Circle, Fill, Rect, Stroke, Text} from './shapes';

export type EntityShapeMap = {
    b1: EntityB1;
    entityRect: EntityRect;
    entityCircle: EntityCircle;
};

export type EntityB1 = Omit<EntityRect, 'type'> & Text & {type: 'b1'; radii: number};

export type EntityShape = EntityRect | EntityCircle | EntityB1;

export type EntitySketchConfig = WithRequired<Partial<EntityShape>, 'type'>;

export type EntityRect = Rect &
    Fill &
    Stroke & {
        type: 'entityRect';
    };

export type EntityCircle = Circle &
    Fill &
    Stroke & {
        type: 'entityCircle';
    };
