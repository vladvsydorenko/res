
export namespace ArrayHelpers {

    export const pushUnique = <T>(value: T, arr: T[]) => {
        if (!arr.includes(value)) arr.push(value);

        return arr;
    }

    export const mergeUnique = <T>(values: T[], arr: T[]) => {
        return values.reduce((acc, value) => {
            return pushUnique(value, acc);
        }, arr);
    }

    export const removeElement = <T>(value: T, arr: T[]) => {
        const index = arr.indexOf(value);

        if (index === -1) return arr;

        arr.splice(index, 1);

        return arr;
    }

}
