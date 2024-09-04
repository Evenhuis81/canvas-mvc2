export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetProperties = <T extends {}, U extends {}, W extends {} | undefined>(
    defaults: T,
    options: U,
    calculatedOptions?: W,
) => W extends undefined ? T & U : T & U & W;

export const getProperties: GetProperties = (defaults, options, calculatedOptions?) =>
    // calculatedOptions ? {...defaults, ...options, ...calculatedOptions ?? {}} : {...defaults, ...options};
