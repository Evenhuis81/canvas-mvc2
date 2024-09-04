export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetProperties = <T extends {}, U extends {}>(defaults: T, options: U, calculatedOptions?: () => U) => T & U;

export const getProperties: GetProperties = (defaults, options, calculatedOptions?) => ({
    ...defaults,
    ...options,
    ...(calculatedOptions ?? {}),
});
