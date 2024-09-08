export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

type GetProperties = <T extends {}, U extends {}>(defaults: T, options: U, calculatedOptions?: () => U) => T & U;

export const getProperties: GetProperties = (defaults, options, calculatedOptions?) => ({
    ...defaults,
    ...options,
    ...(calculatedOptions ?? {}),
});

// https://stackoverflow.com/questions/64297259/how-to-resolve-assertions-require-every-name-in-the-call-target-to-be-declared
export function addProp<T extends object, K extends PropertyKey, V>(
    obj: T,
    key: K,
    value: V,
): asserts obj is T & {[P in K]: V} {
    Object.assign(obj, {[key]: value});
}
