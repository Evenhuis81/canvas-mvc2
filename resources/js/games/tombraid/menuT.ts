import {getCreateEntity} from 'library/entity';
import {LibraryResources} from 'library/types';
import {EntityConfig} from 'library/types/entity';

const entityOptions: EntityConfig = {
    show: false,
    sketch: {
        type: 'rect',
        w: 100,
        h: 50,
    },
    listeners: {
        mouseup: evt => {
            console.log(`Mouse UP`, evt);
        },
        touchend: evt => {
            console.log(`Touch END`, evt);
        },
        startTransition: evt => {
            console.log(`Start Transition`, evt);
        },
        endTransition: evt => {
            console.log(`End Transition`, evt);
        },
    },
};

export const mainMenu = ({context, engine, input}: LibraryResources) => {
    // Entity Return Generic Type based on sketch type input
    const sketch = getCreateEntity(context, engine, input, entityOptions);

    console.log(sketch);
};
