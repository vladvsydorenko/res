export type TId = string | symbol;

export interface THash<T> {
    [id: string]: T;
}

export const insertInHashOfArrays = (value: any, id: TId, hashOfArrays: THash<any>) => {
    const array = hashOfArrays[<string>id] || (hashOfArrays[<string>id] = []);
    const index = array.indexOf(value);

    if (index !== -1) return;
    array.push(value);
}
