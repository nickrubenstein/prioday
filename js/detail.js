const TODO_KEY = 'todo';
document.addEventListener('alpine:init', () => {
    Alpine.data('detail', (todoParamId) => ({
        formTodo: {
            id: crypto.randomUUID(),
            text: 'test',
            repeat: true,
            frequency: 'd1',
            count: 0,
            lastDone: 0,
            lastLastDone: 0,
            source: 'Device',
        },

        formTodoFrequencyUnitValue: 'd',
        get formTodoFrequencyUnit() {
            return this.formTodoFrequencyUnitValue;
        },
        set formTodoFrequencyUnit(unit) {
            this.formTodoFrequencyUnitValue = unit;
            this.updateFrequency();
        },

        formTodoFrequencyCountValue: 1,
        get formTodoFrequencyCount() {
            return this.formTodoFrequencyCountValue;
        },
        set formTodoFrequencyCount(count) {
            this.formTodoFrequencyCountValue = count;
            this.updateFrequency();
        },

        get formTodoLastDoneDate() {
            return (new Date(this.formTodo.lastDone)).toISOString().split('T')[0];
        },
        set formTodoLastDoneDate(date) {
            let offset = (new Date().getTimezoneOffset()) * window.__date.MILLISECONDS_IN_MINUTE;
            this.formTodo.lastDone = (Date.parse(date)) + offset;
        },

        todoList: [ this.formTodo ],
        
        saveTodoList() {
            localStorage.setItem(TODO_KEY, JSON.stringify(this.todoList));
        },

        addTodo() {
            const todo = this.todoList.find(t => t.id == this.formTodo.id);
            if (todo) {
                Object.assign(todo, this.formTodo);
            }
            else {
                this.todoList.push(this.formTodo);
            }
            this.saveTodoList();
        },

        doneTodo(todoId) {
            const todo = this.todoList.find(t => t.id == todoId);
            if (todo) {
                todo.lastLastDone = todo.lastDone;
                todo.lastDone = Date.now();
                this.saveTodoList();
                this.formTodo = {...todo};
            }
        },

        undoTodo(todoId) {
            const todo = this.todoList.find(t => t.id == todoId);
            if (todo) {
                todo.lastDone = todo.lastLastDone;
                this.saveTodoList();
                this.formTodo = {...todo};
            }
        },

        removeTodo(todoId) {
            let removeIndex = this.todoList.findIndex((todo) => todo.id == todoId);
            if (removeIndex >= 0) {
                this.todoList.splice(removeIndex, 1);
                this.saveTodoList();
            }
        },

        updateFrequencyDisplay() {
            this.formTodoFrequencyUnitValue = this.formTodo.frequency.substring(0, 1);
            this.formTodoFrequencyCountValue = this.formTodo.frequency.substring(1);
        },

        updateFrequency() {
            this.formTodo.frequency = this.formTodoFrequencyUnit + this.formTodoFrequencyCount;
        },

        get formTodoFrequencyDisplay() {
            var display = "" + this.formTodoFrequencyCount;
            switch(this.formTodoFrequencyUnit) {
                case 'd': display += ' day'; break;
                case 'w': display += ' week'; break;
                case 'm': display += ' month'; break;
                case 'y': display += ' year'; break;
                default: break;
            }
            if (this.formTodoFrequencyCount > 1) {
                display += 's';
            }
            return display;
        },

        init() {
            try {
                this.todoList = JSON.parse(localStorage.getItem(TODO_KEY)) || [ this.formTodo ];
            }
            catch {
                this.todoList = [ this.formTodo ];
            }
            if (todoParamId) {
                const todo = this.todoList.find(t => t.id == todoParamId);
                if (todo) {
                    this.formTodo = {...todo};
                }
            }
            this.updateFrequencyDisplay();
        }
    }));
})