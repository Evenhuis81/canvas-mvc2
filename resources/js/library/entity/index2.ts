export const createEntity2 = <T extends keyof EntityShMap>(
    type: T,
    shape?: EntityShMap[T],
): {sketch: EntityShMap[T]} => {
    const sk = {
        sketch: {...shDefaults[type], ...shape},
    };

    return sk;
};

const ciT = createEntity2('ci');
// const ciT = createEntity2('ci', {
//     ciProp: 8,
// });

// const reT = createEntity2('re', {
const reT = createEntity2('re');
//     // type: 'ci',
//     reProp: true,
// });

const shDefaults: EntityShMap = {
    ci: {
        // type: 'ci',
        ciProp: 5,
    },
    re: {
        // type: 're',
        reProp: false,
    },
};

type EntityShMapConfig<T extends keyof EntityShMap> = {
    [K in T]: EntityShMap[K];
};

type EntityShMap = {
    ci: EntityCi;
    re: EntityRe;
};

type EntityCi = {
    // type: 'ci',
    ciProp: number;
};

type EntityRe = {
    // type: 're',
    reProp: boolean;
};
