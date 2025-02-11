// when called synchronously, this will not be an unique id
export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// type GetProperties = <T extends {}, U extends {}>(defaults: T, options: U, calculatedOptions?: () => U) => T & U;
type GetProperties = <T extends {}, U extends {}>(defaults: T, options: U) => T & U;

// Extend method or disregard
export const getProperties: GetProperties = (defaults, options) => ({
    ...defaults,
    ...options,
});

// Test calculatedOptions
// export const getProperties: GetProperties = (defaults, options, calculatedOptions?) => ({
//     ...defaults,
//     ...options,
//     ...(calculatedOptions ? calculatedOptions() : {}),
// });

// https://stackoverflow.com/questions/76018978/typing-for-progressively-adding-properties-to-an-object
export function addProp<T extends object, K extends PropertyKey, V>(
    obj: T,
    key: K,
    value: V,
): asserts obj is T & {[P in K]: V} {
    Object.assign(obj, {[key]: value});
}

export const counter = {
    count: 0,
    increase: () => counter.count++,
    decrease: () => counter.count--,
};

export const makeObjectValueMoverPartial =
    <Key extends string | number | symbol>(keys: Key[]) =>
    <Obj extends Partial<Record<Key, unknown>>>(
        obj: Obj,
    ): {result: Omit<Obj, Key>; copied: {type: Key; value: Obj[Key]}[]} => {
        const result = {...obj};
        const copied: {type: Key; value: Obj[Key]}[] = [];
        keys.forEach(key => {
            if (key in obj) {
                copied.push({type: key, value: result[key]});
                delete result[key];
            }
        });

        return {result, copied};
    };
