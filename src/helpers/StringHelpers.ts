export namespace StringHelpers {

    export const generateNumber = (number: number, digits: number = 1) => {
        let stringNumber = number.toString();
        const stringDigits = stringNumber.length;

        if (stringDigits === digits) return stringNumber;

        for (let i = 0; i < (digits - stringDigits); i++) {
            stringNumber = '0' + stringNumber;
        }

        return stringNumber;
    }

}
