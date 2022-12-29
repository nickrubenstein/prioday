
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const daysAgo = (oldDate: number | Date, newDate?: number | Date) => {
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
    const duration = (new Date(newDate.toLocaleDateString())).getTime()
        - (new Date(oldDate.toLocaleDateString())).getTime();
    return Math.round(duration / MILLISECONDS_IN_DAY);
};

