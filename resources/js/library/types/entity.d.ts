import {Circle, Fill, Rect, Stroke, Text} from './shapes';
import {EngineDraw, EngineUpdate} from './engine';
import {InputListenerEventMap} from './input';

export type GeneralProperties = {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
    clicked: boolean; // Also in transitionEventProps
    hideDelay: number;
};

export interface VisualProperties {
    start: EntityTransitions;
    end: EntityTransitions;
    animation: EntityAnimations;
    hover: EntityHovers;
    startSpeed: TransitionSpeed;
    endSpeed: TransitionSpeed;
}

export type EntityAnimations = 'noise';
export type EntityTransitions = 'fadein1' | 'fadeout1' | 'slideinleft' | 'explode';
export type EntityHovers = 'bold';

export type VisualType = EntityAnimations | EntityTransitions | EntityHovers;

export type SetHideTime = (time: number) => void;
export type SetVisual = (kind: Exclude<keyof Visuals, 'draw'>, type: VisualType) => void;

export type EntityConfig = Partial<
    {sketch: Partial<EntityShapeT>} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners & EntityInputListeners<EntityInputListenerType>>;
        }
>;

export type EntityShapeMap = {
    rect: Rect & {type: 'rect'};
    circle: Circle & {type: 'circle'};
};

export type EntityShapeT = (Rect & {type: 'rect'}) | (Circle & {type: 'circle'});

export type EntityConfigT = Partial<{sketch: Partial<EntityShapeT>}>;

export type EntityShape = EntityRect | EntityCircle;

export type EntityRect = Rect &
    Fill &
    Stroke &
    Text & {
        type: 'rect';
    };

export type EntityCircle = Circle &
    Fill &
    Stroke &
    Text & {
        type: 'circle';
    };

export type StartTransitionEvent = {testProperty: string};
export type EndTransitionEvent = {pressed: boolean; pushed: boolean; clicked: boolean};

export type EntityListenerEvents = {
    startTransition: StartTransitionEvent;
    endOfStartTransition: StartTransitionEvent;
    endTransition: EndTransitionEvent;
    endOfEndTransition: EndTransitionEvent;
};

export type EntityListeners = {
    [K in keyof EntityListenerEvents]: (evt: EntityListenerEvents[K]) => void;
};

export type EntityInputListenerType = 'mouseup' | 'mousedown' | 'touchstart' | 'touchend';

export type EntityInputListeners<T extends EntityInputListenerType> = {
    [K in T]: (evt: HTMLElementEventMap[K]) => void;
};

type ActivateListener = () => void;
type DeactivateListener = () => boolean;
type ListenerActive = boolean;

export type EntityInputListenerHandler = [
    EntityInputListenerType,
    ActivateListener,
    DeactivateListener,
    ListenerActive,
];

export type AddEntityInputListener = <K extends EntityInputListenerType>(
    type: K, // = ID (1 type per entity)
    listener: (evt: HTMLElementEventMap[K]) => void,
    activate?: boolean,
) => void;

export type AddListener = (
    type: keyof EntityListenerEvents | EntityInputListenerType,
    listener: (
        evt: (EntityListenerEvents & InputListenerEventMap)[keyof EntityListenerEvents | EntityInputListenerType],
    ) => void,
) => void;

export type RemoveEntityInputListener = (type: EntityInputListenerType) => void;
export type RemoveListener = (type: keyof EntityListenerEvents | EntityInputListenerType) => void;

export interface EventHandler {
    addListener: AddListener;
    removeListener: RemoveListener;
    activateInputListeners: () => void;
    deactivateInputListeners: () => void;
    entityListenerEvents: Partial<EntityListenerEvents>;
    entityListeners: Partial<EntityListeners>;
}

export type SketchType = 'rect' | 'circle';

export type EntityT<T extends SketchType> = {
    sketch: EntityShapeMap[T];
};

export type Entity = {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
    // sketch: ShapeMap[T];
};

export interface Callbacks {
    start: (prepare?: () => void) => void;
    endOfStart: () => void;
    end: (prepare?: () => void) => void;
    endOfEnd: () => void;
}

export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

export type Renderer = {
    update: Required<EngineUpdate>;
    prepare?: () => void;
};

export interface Visuals {
    animation?: Renderer;
    hover?: Renderer;
    start?: Renderer;
    end?: Renderer;
    draw: Required<EngineDraw>;
}

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;

export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
