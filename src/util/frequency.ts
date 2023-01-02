import * as Dates from "./dates";

export const next = (lastDone: number, frequency: string) => {
    const date = lastDone > 0 ? Dates.getDate(lastDone) : Dates.getDate();
    const unit = frequency[0];
    const count = +frequency.substring(1);
    switch (unit) {
        case 'd': {
            date.setDate(date.getDate() + count); break;
        }
        case 'w': {
            date.setDate(date.getDate() + (7 * count)); break;
        }
        case 'm': {
            date.setMonth(date.getMonth() + count); break;
        }
        case 'y': {
            date.setFullYear(date.getFullYear() + count); break;
        }
    }
    return date;
};

const order = ['y','m','w','d'];

export const sort = (a: string, b: string) => {
    if (a === b) {
        return 0;
    }
    const aUnit = a[0];
    const bUnit = b[0];
    const aCount = +a.substring(1);
    const bCount = +b.substring(1);
    for (let o in order) {
        if (aUnit === o) {
            if (bUnit === o) {
                return aCount - bCount;
            }
            else {
                return -1;
            }
        }
        else if (bUnit === o) {
            return 1;
        }
    }
    return 0;
}