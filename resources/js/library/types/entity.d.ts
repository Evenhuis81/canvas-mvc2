import {EngineDraw, EngineUpdate} from './engine';
import {InputListenerEventMap} from './input';
import {ShapesConfig} from './shapes';

export type GeneralProperties = {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
    clicked: boolean;
    hideTime: number;
};

export interface VisualProperties {
    animateAtStart: boolean;
    animateAtEnd: boolean;
    animationType?: EntityAnimations;
    hoverType?: EntityHovers;
    startType?: EntityTransitions;
    startSpeed: TransitionSpeed;
    endType?: EntityTransitions;
    endSpeed: TransitionSpeed;
}

export type EntityAnimations = 'noise';
export type EntityTransitions = 'fadein1' | 'fadeout1' | 'slideinleft' | 'explode';
export type EntityHovers = 'bold';

export type VisualType = EntityAnimations | EntityTransitions | EntityHovers;

export type SetHideTime = (time: number) => void;
export type SetVisual = (kind: Exclude<keyof Visuals, 'draw'>, type: VisualType) => void;

export type EntityConfig = Partial<
    {sketch: ShapesConfig} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners & EntityInputListeners<keyof InputListenerEventMap>>;
        }
>;

export type StartTransitionEvent = {testProperty: string};
export type FinishTransitionEvent = {pressed: boolean; pushed: boolean; clicked: boolean};

export type EntityListenerEventMap = {
    startTransition: StartTransitionEvent;
    finishTransition: FinishTransitionEvent;
};

export type EntityListeners = {
    [Key in keyof EntityListenerEventMap]: (evt: EntityListenerEventMap[Key]) => void;
};

export type EntityInputListenerType = 'mouseup' | 'mousedown' | 'touchstart' | 'touchend';

export type EntityInputListeners<K extends keyof InputListenerEventMap> = {
    [Key in K]: (evt: HTMLElementEventMap[Key]) => void;
};

export type ListenersGeneric<K extends keyof EntityListenerEventMap | EntityInputListenerType> = {
    [Key in K]: (evt: (EntityListenerEventMap & InputListenerEventMap)[K]) => void;
};

type ActivateListener = () => void;
type DeactivateListener = () => boolean;
type ListenerActive = boolean;

export type InputListenerHandler = [EntityInputListenerType, ActivateListener, DeactivateListener, ListenerActive];

export type AddEntityInputListener = <K extends EntityInputListenerType>(
    type: K, // = ID (1 type per entity)
    listener: (evt: HTMLElementEventMap[K]) => void,
    activate?: boolean,
) => void;

export type AddListener = <K extends keyof EntityListenerEventMap | EntityInputListenerType>(
    type: K,
    listener: (evt: (EntityListenerEventMap & InputListenerEventMap)[K]) => void,
) => void;

export type RemoveInputListener = (type: keyof InputListenerEventMap) => void;
export type RemoveListener = (type: keyof EntityListenerEventMap | keyof InputListenerEventMap) => void;

export interface EventHandler {
    addListener: AddListener;
    removeListener: RemoveListener;
    activateInputListeners: () => void;
    deactivateInputListeners: () => void;
    entityListenerEvents: EntityListenerEventMap;
    startTransition?: (event: StartTransitionEvent) => void;
    finishTransition?: (event: FinishTransitionEvent) => void;
}

export interface Entity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

export type Renderer = {
    update: Required<EngineUpdate>;
    prepare?: () => void;
};

export interface Visuals {
    entity?: Renderer;
    hover?: Renderer;
    start?: Renderer;
    end?: Renderer;
    draw: Required<EngineDraw>;
}

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;

export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
