type Transitions = {
    steps: number;
    on: (id: string) => void;
    off: (id: string) => void;
}[];

type Transition = {
    steps: number;
    forward: () => void;
    reverse: () => void;
};

type TransitionTypes = 'fill' | 'stroke' | 'textFill';
