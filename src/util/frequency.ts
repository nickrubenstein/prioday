


export const next = (lastDone: number, frequency: string) => {
    const last = lastDone > 0 ? new Date(lastDone) : new Date();
    let next = null;
    let unit = frequency[0];
    frequency = frequency.substring(1);
    if (unit === 'd') {
        next = last.setDate(last.getDate() + +frequency);
    }
    if (unit === 'w') {
        next = last.setDate(last.getDate() + (7 * +frequency));
    }
    if (unit === 'm') {
        next = last.setMonth(last.getMonth() + +frequency);
    }
    if (!next) {
        return new Date();
    }
    return new Date(next);
};

const order = ['m','w','d'];

export const sortFrequencies = (a: string, b: string) => {
    if (a === b) {
        return 0;
    }
    for (let o in order) {
        if (a[0] === o) {
            if (b[0] === o) {
                return +a.substring(1) - +b.substring(1);
            }
            else {
                return 1;
            }
        }
        if (b[0] === o) {
            return -1;
        }
    }
    return 0;
}