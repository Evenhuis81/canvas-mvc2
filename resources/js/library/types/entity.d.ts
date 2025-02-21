import {EngineDraw, EngineUpdate} from './engine';
import {InputListenerEventMap} from './input';
import {EntityShapeMap, EntitySketchMap} from './entitySketch';

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
export type EntityHovers = 'bold';
export type EntityTransitions = 'fadein1' | 'fadeout1' | 'explode';

export type Effects = EntityAnimations | EntityTransitions | EntityHovers;

export type SetHideTime = (time: number) => void;
export type SetVisual = (type: Exclude<keyof Visuals, 'draw'>, effect: Effects) => void;

export type EntityConfig<K extends keyof EntityShapeMap> = Partial<
    {sketch: Partial<EntityShapeMap[K]>} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners & EntityInputListeners<EntityInputListenerType>>;
        }
>;

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
    entityListenerEvents: EntityListenerEvents;
    entityListeners: Partial<EntityListeners>;
    // callbacks: Callbacks;
}

export type Callbacks = {
    start: {
        fn: () => void;
        empty: boolean;
    };
    endOfStart: {
        fn: () => void;
        empty: boolean;
    };
    end: {
        fn: () => void;
        empty: boolean;
    };
    endOfEnd: {
        fn: () => void;
        empty: boolean;
    };
};

export type Entity = EntityGeneric<keyof EntityShapeMap>;

export type EntityGeneric<K extends keyof EntityShapeMap> = {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
    sketch: EntitySketchMap[K];
};

export type CreateEntity = <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>) => EntityGeneric<K>;

export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

export type Visual = {
    visual: EngineUpdate;
    prepare?: () => void;
};

export type Visuals = {
    animation: Visual;
    hover: Visual;
    start: Visual;
    end: Visual;
    draw: EngineDraw;
};

// export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;

// export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
