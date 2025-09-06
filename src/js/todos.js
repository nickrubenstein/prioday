const TODO_KEY = 'todo';
document.addEventListener('alpine:init', () => {
    Alpine.data('todos', () => ({

        todoList: [ ],
        
        saveTodoList() {
            this.sortTodoList();
            localStorage.setItem(TODO_KEY, JSON.stringify(this.todoList));
        },

        sortTodoList() {
            this.todoList.sort(this.sortTodos);
        },

        doneTodo(todoId) {
            const todo = this.todoList.find(t => t.id == todoId);
            if (todo) {
                todo.lastLastDone = todo.lastDone;
                todo.lastDone = Date.now();
                if (!todo.repeat) {
                    todo.count--;
                }
                this.saveTodoList();
            }
        },

        removeTodo(todoId) {
            let removeIndex = this.todoList.findIndex(t => t.id == todoId);
            if (removeIndex >= 0) {
                this.todoList.splice(removeIndex, 1);
                this.saveTodoList();
            }
        },

        sortTodos(a, b) {
            if (a.lastDone == 0 || a.lastDone == null) {
                if (b.lastDone != 0 && b.lastDone != null) {
                    return -1;
                }
            }
            else {
                if (b.lastDone == 0 || b.lastDone == null) {
                    return 1;
                }
            }
            const aNext = window.__date.nextDate(a.lastDone, a.frequency).getTime();
            const bNext = window.__date.nextDate(b.lastDone, b.frequency).getTime();
            if (aNext === bNext) {
                if (a.frequency === b.frequency) {
                    return 0;
                }
                const aUnit = a.frequency[0];
                const bUnit = b.frequency[0];
                const aCount = +a.frequency.substring(1);
                const bCount = +b.frequency.substring(1);
                for (let o of ['y','m','w','d']) {
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
            return aNext - bNext;
        },

        init() {
            try {
                this.todoList = JSON.parse(localStorage.getItem(TODO_KEY)) || [ ];
                this.sortTodoList();
            }
            catch {
                this.todoList = [ ];
            }
        }
    }));
})