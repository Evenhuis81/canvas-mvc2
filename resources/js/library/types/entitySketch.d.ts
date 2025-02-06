import {WithRequired} from '.';
import {Circle, Fill, Rect, Stroke} from './shapes';

export type EntityShapeMap = {
    entityRect: EntityRect;
    entityCircle: EntityCircle;
};

export type EntityShape = EntityRect | EntityCircle;

export type EntitySketchConfig = WithRequired<Partial<EntityShape>, 'type'>;

export type EntityRect = Rect &
    Fill &
    Stroke & {
        radii: number;
        type: 'entityRect';
    };

export type EntityCircle = Circle &
    Fill &
    Stroke & {
        type: 'entityCircle';
    };
