export type TId = string | symbol;

export interface THash<T> {
    [id: string]: T;
}
