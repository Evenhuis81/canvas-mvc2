import {EngineUpdate, UpdateOrDraw} from './engine';
import {BaseSketch, EntityShapeMap, EntitySketchMap} from './entitySketch';
import {InputListenerEventMap, LibraryInput} from './input';

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

export type EntityConfig<K extends keyof EntityShapeMap> = Partial<
    {sketch: Partial<EntityShapeMap[K]>} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners & EntityInputListeners<EntityInputListenerType>>;
        }
>;

export type StartTransitionEvent = {testProperty: string};
export type EndTransitionEvent = {pressed: boolean; pushed: boolean; clicked: boolean};

type CallbackTypes = 'start' | 'end' | 'endOfStart' | 'endOfEnd';

export type Callbacks = {
    [K in CallbackTypes]: () => void;
};

export type VisualCallbacks = Omit<Callbacks, 'start' | 'end'>;

export type UserMethodCallbacks = Omit<Callbacks, 'endOfStart' | 'endOfEnd'>;

export type SetHideTime = (time: number) => void;

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

export interface EntityHandler {
    addListener: AddListener;
    removeListener: RemoveListener;
    activateInputListeners: () => void;
    deactivateInputListeners: () => void;
    entityListeners: Partial<EntityListeners>;
}

// export type Entity = EntityGeneric<keyof EntityShapeMap>;

// export type EntityGeneric<K extends keyof EntityShapeMap> = {
export type EntityGeneric = {
    show: () => void;
    hide: () => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    // setHideTime: SetHideTime;
    // setVisual: SetVisual;
    // setDraw: SetDraw;
    // sketch: EntitySketchMap[K];
    sketch: BaseSketch;
};

export type CreateEntity = <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>) => EntityGeneric<K>;

export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

type VisualType = 'animation' | 'hover' | 'start' | 'end' | 'draw';

export type GetVisual = (visual: VisualConfig, next: VisualNext) => Visual<'update'>;
export type GetDraw = () => Visual<'draw'>;

export type EntityAnimations = 'noise';
export type EntityHovers = 'enlarge';
export type EntityTransitions = 'fadein' | 'fadeout' | 'explode';

export type EffectType = EntityAnimations | EntityTransitions | EntityHovers;

export type VisualNext = () => void;

export type VisualConfig = {
    visualType: VisualType;
    effectType: EffectType;
    get: (sketch: BaseSketch, next: VisualNext, input: LibraryInput) => VisualCreation;
};

export type Effect = (sketch: BaseSketch, next: VisualNext, input: LibraryInput) => VisualCreation;

export type VisualCreation = {
    render: EngineUpdate['fn'];
    pre?: () => void;
    post?: () => void;
};

export type Visual<T extends 'draw' | 'update'> = {
    render: UpdateOrDraw<T>;
    pre?: () => void;
    post?: () => void;
};

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue';

export type SetEngine = (type: VisualType, state: EngineState) => void;
