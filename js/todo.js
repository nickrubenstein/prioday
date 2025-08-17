document.addEventListener('alpine:init', () => {
    Alpine.data('todo', (todo, index, el) => ({
        todoVisible: false,
        todoIndex: index,
        lastDoneDate: "",
        lastDoneAgo: "",
        nextDoneDate: "",
        nextDoneIn: "",
        doneToday: false,
        dueToday: false,
        overdue: false,
        animateTodo: "",
        animateTodoDelta: 0,

        updateTodoInfo() {
            var lastDate = window.__date.getDate(todo.lastDone);
            var todayDate = window.__date.getDate();
            var nextDate = window.__date.nextDate(todo.lastDone, todo.frequency);
            this.lastDoneDate = window.__date.getDateString(lastDate);
            var isNew = this.lastDoneDate == 'New';
            this.lastDoneAgo = window.__date.getDaysAgoString(lastDate, todayDate, false);
            this.nextDoneDate = isNew ? 'Today' : window.__date.getDateString(nextDate);
            this.nextDoneIn = isNew ? '' : window.__date.getDaysAgoString(todayDate, nextDate, true);
            this.doneToday = lastDate.getTime() == todayDate.getTime();
            this.dueToday = isNew ? true : nextDate.getTime() == todayDate.getTime();
            this.overdue = nextDate.getTime() < todayDate.getTime();
        },

        updateTodoOrder(newIndex) {
            if (window.__settings.animation && this.todoIndex != newIndex) {
                this.$nextTick(() => {
                    this.animateTodo = "animateTodo";
                    this.animateTodoDelta = ((newIndex - this.todoIndex) * -el.offsetHeight) + 'px';
                    // console.log(this.todoIndex + " ==> " + newIndex + " " + this.animateTodoDelta);
                    this.todoIndex = newIndex;
                    setTimeout(() => {
                        this.animateTodo = "";
                        this.animateTodoDelta = 0;
                    }, 500);
                });
            }
        },

        init() {
            this.updateTodoInfo();
            if (window.__settings.animation) {
                setTimeout(() => {
                    this.todoVisible = true;
                }, index * 50);
            }
            else {
                this.todoVisible = true;
            }
        }
    }));
})