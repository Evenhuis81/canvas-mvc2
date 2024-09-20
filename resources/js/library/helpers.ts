export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetProperties = <T extends {}, U extends {}>(defaults: T, options: U, calculatedOptions?: () => U) => T & U;

// Test calculatedOptions having the same Type as options (doesn't work probably)
export const getProperties: GetProperties = (options, defaults, calculatedOptions?) => ({
    ...defaults,
    ...options,
    ...(calculatedOptions ?? {}),
});

// https://stackoverflow.com/questions/76018978/typing-for-progressively-adding-properties-to-an-object
export function addProp<T extends object, K extends PropertyKey, V>(
    obj: T,
    key: K,
    value: V,
): asserts obj is T & {[P in K]: V} {
    Object.assign(obj, {[key]: value});
}
