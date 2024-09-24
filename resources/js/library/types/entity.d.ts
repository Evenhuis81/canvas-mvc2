interface EntitySketch {
    x: number;
    y: number;
    w: number;
    h: number;
    lw: number;
    r: number;
    stroke: string;
    fill: string;
    textFill: string;
    text: string;
    font: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
}

interface EntityEvents {
    show: () => void;
    hide: () => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
}

interface EntityProperties {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
}

interface EntityListeners {
    add: () => void;
    remove: () => void;
}

type EntityAnimationType = 'noise';

type EntityTransitionTypes = 'fadein1' | 'fadeout1';

type EntityHoverTransitionTypes = 'bold';

type EntityTypes = EntityAnimationType | EntityTransitionTypes | EntityHoverTransitionTypes;

interface EntityAnimations {
    animation: EntityAnimationType;
    start: EntityTransitionTypes;
    startSpeed: 1 | 2 | 3;
    end: EntityTransitionTypes;
    endSpeed: 1 | 2 | 3;
    hover: EntityHoverTransitionTypes;
}

interface TransitionHandlers {
    onStartEnd: () => void;
    onEndEnd: () => void;
}

// handlers = user input, listeners = browser implemented
interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    events: EntityEvents;
    handlers: MouseHandlers & TransitionHandlers;
    listeners: EntityListeners;
    animations: EntityAnimations;
    // part of EntitySketch?
    colors: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
    };
}

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)
interface MouseHandlers {
    up: (event: MouseEvent) => void;
    down: (event: MouseEvent) => void;
    button: number;
}

interface EntityHandlers extends TransitionHandlers {
    mouse: Partial<MouseHandlers>;
}

type Addition<Key extends string> = Key;

type EntityAnimationsConfig<Type> = {
    // [Property in keyof Type as `get${Capitalize<string & Property>}`]
    [Property in keyof Type as `${string & Property}Type`]: Type[Property];
};

// type Getters<Type> = {
//     [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
// };

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers & EntityAnimationsConfig<EntityAnimations>;

type InternalEntity = Omit<Entity, 'events' | 'animations'> & {
    animations: Partial<EntityAnimations>;
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};

type SetEngine = () => void;

type EntityRenders = Record<
    Exclude<keyof EntityAnimations, 'draw' | 'startSpeed' | 'endSpeed'>,
    Required<Update> | void
> & {
    draw: Required<Draw>;
};
