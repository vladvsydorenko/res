export type TId = string | symbol;

export interface THash<T> {
    [id: string]: T;
}

export const insertUniqueInHash = (value: any, id: TId, hashOfArrays: THash<any>) => {
    const arr = hashOfArrays[<string>id] || (hashOfArrays[<string>id] = []);
    inserthUnique(value, arr);
    return hashOfArrays;
}

export const inserthUnique = (value: any, arr: any[]) => {
    const index = arr.indexOf(value);
    if (index === -1) arr.push(value);
    return arr;
};

export const removeByValue = (value: any, arr: any[]) => {
    const index = arr.indexOf(value);
    if (index === -1) return arr;

    arr.splice(index, 1);
    return arr;
};

