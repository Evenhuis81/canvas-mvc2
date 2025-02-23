import {EngineDraw, EngineUpdate, UpdateOrDraw} from './engine';
import {EntityShapeMap, EntitySketchMap} from './entitySketch';
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

export interface EventHandler {
    addListener: AddListener;
    removeListener: RemoveListener;
    activateInputListeners: () => void;
    deactivateInputListeners: () => void;
    entityListenerEvents: EntityListenerEvents;
    entityListeners: Partial<EntityListeners>;
}

export type Entity = EntityGeneric<keyof EntityShapeMap>;

export type EntityGeneric<K extends keyof EntityShapeMap> = {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
    setDraw: SetDraw;
    sketch: EntitySketchMap[K];
};

export type CreateEntity = <K extends keyof EntityShapeMap>(type: K, options?: EntityConfig<K>) => EntityGeneric<K>;

export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

type VisualType = 'animation' | 'hover' | 'start' | 'end' | 'draw';

export type SetVisual = (type: Exclude<VisualType, 'draw'>, effect: Effects) => void;
export type SetDraw = (sketch: EntitySketchMap['button1']) => void;

export type EntityAnimations = 'noise';
export type EntityHovers = 'bold';
export type EntityTransitions = 'fadein1' | 'fadeout1' | 'explode';

export type Effects = EntityAnimations | EntityTransitions | EntityHovers;

export type Visual = {
    render: EngineUpdate['fn'] | EngineDraw['fn'];
    pre?: () => void;
    post?: () => void;
    callback?: () => void;
};

export type Visuals = {[K in VisualType]: Omit<Visual, 'render'> & {render: UpdateOrDraw<'draw' | 'update'>}};

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue';

export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
