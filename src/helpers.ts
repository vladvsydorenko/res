export namespace ArrayHelpers {

    export const filterOne = (arr: any[], fn: (value: any, index: number) => boolean) => {
        let index = -1;

        arr.some((value, i) => {
            if (fn(value, i)) index = i;
            return i > -1;
        });

        if (index === -1) return [...arr];

        return [
            ...arr.slice(0, index),
            ...arr.slice(index + 1),
        ];
    }

    export const pushUnique = (arr: any[], value: any, fn: (value: any, index: number) => boolean) => {
        let index = -1;

        arr.some((value, i) => {
            if (fn(value, i)) index = i;
            return i > -1;
        });

        if (index === -1) return [...arr, value];

        return [
            ...arr.slice(0, index),
            ...arr.slice(index + 1),
            value,
        ];
    }

}