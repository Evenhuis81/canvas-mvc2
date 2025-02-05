import {getCreateEntity} from 'library/entity';
import {LibraryResources} from 'library/types';
import {EntityConfigT} from 'library/types/entity';

const entityOptions: EntityConfigT = {
    sketch: {
        type: 'rect',
        w: 100,
        h: 50,
    },
};

export const mainMenu = ({context, engine, input}: LibraryResources) => {
    // Entity Return Generic Type based on sketch type input
    const sketch = getCreateEntity(context, engine, input, entityOptions);

    console.log(sketch);
};
