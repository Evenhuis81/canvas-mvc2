export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetProperties = <T extends {}, U extends {}, W extends {}>(
    options: T,
    defaults: U,
    calculatedOptions?: () => W,
) => T & U;

export const getProperties: GetProperties = (options, defaults, calculatedOptions?) => {
    if (calculatedOptions) return {...defaults, ...options, ...calculatedOptions()};

    return {...defaults, ...options};
};
