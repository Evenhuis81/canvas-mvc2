import {Circle, Fill, Rect, Stroke} from './shapes';

export type EntityShapeMap = {
    entityRect: EntityRect;
    entityCircle: EntityCircle;
};

// export type EntityShape = (Rect & {type: 'rect'}) | (Circle & {type: 'circle'});

// export type EntityConfig = Partial<{sketch: Partial<EntityShape>}>;

// export type EntityShape = EntityRect | EntityCircle;

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
