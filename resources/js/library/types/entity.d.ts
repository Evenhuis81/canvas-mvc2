import {BaseID} from '.';
import {EngineDraw, EngineUpdate} from './engine';
import {Shapes, ShapesConfig} from './shapes';

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

export type StartEndTransitionEvent = {startEndProp: string};
export type EndEndTransitionEvent = {endEndProp: string};

export type ListenerTemplate<T extends object, K extends keyof T> = {
    type: K; // = ID (1 type per entity)
    listener: (evt: T[K]) => void;
};

export type NativeListener = ListenerTemplate<HTMLElementEventMap, keyof HTMLElementEventMap>;
export type EntityListener = ListenerTemplate<EntityEventMap, keyof EntityEventMap>;

export type EntityEventMap = {
    startTransitionEnd: StartEndTransitionEvent;
    endTransitionEnd: EndEndTransitionEvent;
};

export type NativeListenerMap<T extends keyof HTMLElementEventMap> = {
    [K in T]: (evt: HTMLElementEventMap[K]) => void;
};

export type EntityListenerMap<T extends keyof EntityEventMap> = {
    [K in T]: (evt: EntityEventMap[K]) => void;
};

export type EntityConfig = Partial<
    {sketch: ShapesConfig} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<NativeListenerMap<keyof HTMLElementEventMap>>;
        }
>;

type ActivateListener = () => symbol;
type DeactivateListener = () => boolean;

export type AddNativeListener = <K extends keyof HTMLElementEventMap>(
    type: K, // = ID (1 type per entity)
    listener: (evt: HTMLElementEventMap[K]) => void,
    activate?: boolean,
) => symbol;

export type RemoveNativeListener = (type: keyof HTMLElementEventMap) => void;

export interface EventHandler {
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
    activateNativeListeners: () => void;
    deactivateNativeListeners: () => void;
    startTransitionEnd?: (evt: StartEndTransitionEvent) => void;
    endTransitionEnd?: (evt: EndEndTransitionEvent) => void;
}

export interface Entity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
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
