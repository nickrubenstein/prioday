
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const getDate = (date?: Date | number) => {
    if (!(date instanceof Date)) {
        if (date === undefined) {
            date = new Date();
        }
        else {
            date = new Date(date);
        }
    }
    date.setHours(0,0,0,0);
    return date;
}

export const getDateString = (date: Date) => {
    const today = getDate();
    const yesterday = new Date(today.getTime());
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(today.getDate() + 1);
    if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }
    if (date.getTime() === today.getTime()) {
        return 'Today';
    }
    if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    }
    return date.toLocaleDateString();
}

export const getDaysAgo = (oldDate: number | Date, newDate?: number | Date) => {
    if (!(oldDate instanceof Date)) {
        oldDate = new Date(oldDate);
    }
    if (!(newDate instanceof Date)) {
        if (newDate) {
            newDate = new Date(newDate);
        }
        else {
            newDate = new Date();
        }
    }
    const duration = getDate(newDate).getTime() - getDate(oldDate).getTime();
    return Math.round(duration / MILLISECONDS_IN_DAY);
};

