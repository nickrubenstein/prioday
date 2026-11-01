window.__date = {
    MILLISECONDS_IN_MINUTE: 60 * 1000,
    MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,

    get today() {
        return (new Date()).toLocaleString(undefined, 
            { 
                year: '2-digit',
                month: '2-digit',
                day: '2-digit' 
            });
    },

    getDate(date) {
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
    },
    
    getDateString(date) {
        if (date.getTime() == -64800000) {
            return 'New';
        }
        const today = this.getDate();
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
    },
    
    getDaysAgoString(oldDate, newDate, inFuture) {
        if (!(oldDate instanceof Date)) {
            oldDate = new Date(oldDate);
        }
        if (oldDate.getTime() == -64800000) {
            return '';
        }
        if (!(newDate instanceof Date)) {
            if (newDate) {
                newDate = new Date(newDate);
            }
            else {
                newDate = new Date();
            }
        }
        const duration = this.getDate(newDate).getTime() - this.getDate(oldDate).getTime();
        const days = Math.round(duration / this.MILLISECONDS_IN_DAY);
        let text = Math.abs(days) == 1 ? Math.abs(days) + ' day' : Math.abs(days) + ' days';
        if (days == 0) {
            return '';
        }
        else if (days < 0) {
            return text + (inFuture ? ' overdue' : '');
        }
        else {
            return (inFuture ? 'in ' : '') + text + (inFuture ? '' : ' ago');
        }
    },

    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    init() {

    }
}

document.addEventListener('alpine:init', () => {
    Alpine.data('date', () => window.__date)
})