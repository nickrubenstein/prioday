class TodoListController {
    constructor() {
        this.todoList = [];
        this.loadTodoList();
    }

    loadTodoList() {
        try {
            this.todoList = JSON.parse(localStorage.getItem('todo')) || [];
            this.sortTodoList();
        } catch {
            this.todoList = [];
        }
    }

    saveTodoList() {
        this.sortTodoList();
        localStorage.setItem('todo', JSON.stringify(this.todoList));
    }

    sortTodoList() {
        this.todoList.sort(this.sortTodos);
    }

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
    }

    removeTodo(todoId) {
        let removeIndex = this.todoList.findIndex(t => t.id == todoId);
        if (removeIndex >= 0) {
            this.todoList.splice(removeIndex, 1);
            this.saveTodoList();
        }
    }

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
    }
}

class TodoItemController {
    constructor(todo, index, element) {
        this.todo = todo;
        this.todoIndex = index;
        this.element = element;
        this.todoVisible = false;
        this.lastDoneDate = "";
        this.lastDoneAgo = "";
        this.nextDoneDate = "";
        this.nextDoneIn = "";
        this.doneToday = false;
        this.dueToday = false;
        this.overdue = false;
        this.animateTodo = "";
        this.animateTodoDelta = 0;
    }

    updateTodoInfo() {
        var lastDate = window.__date.getDate(this.todo.lastDone);
        var todayDate = window.__date.getDate();
        var nextDate = window.__date.nextDate(this.todo.lastDone, this.todo.frequency);
        this.lastDoneDate = window.__date.getDateString(lastDate);
        var isNew = this.lastDoneDate == 'New';
        this.lastDoneAgo = window.__date.getDaysAgoString(lastDate, todayDate, false);
        this.nextDoneDate = isNew ? 'Today' : window.__date.getDateString(nextDate);
        this.nextDoneIn = isNew ? '' : window.__date.getDaysAgoString(todayDate, nextDate, true);
        this.doneToday = lastDate.getTime() == todayDate.getTime();
        this.dueToday = isNew ? true : nextDate.getTime() == todayDate.getTime();
        this.overdue = nextDate.getTime() < todayDate.getTime();
    }

    updateTodoOrder(newIndex) {
        if (window.__settings.animation && this.todoIndex != newIndex) {
            requestAnimationFrame(() => {
                this.animateTodo = "animateTodo";
                this.animateTodoDelta = ((newIndex - this.todoIndex) * -this.element.offsetHeight) + 'px';
                this.todoIndex = newIndex;
                this.element.style.setProperty('--animate-todo-delta', this.animateTodoDelta);
                this.element.classList.add(this.animateTodo);
                setTimeout(() => {
                    this.animateTodo = "";
                    this.animateTodoDelta = 0;
                    this.element.style.setProperty('--animate-todo-delta', '0px');
                    this.element.classList.remove('animateTodo');
                }, 500);
            });
        }
    }

    init() {
        this.updateTodoInfo();
        if (window.__settings.animation) {
            setTimeout(() => {
                this.todoVisible = true;
                this.element.style.display = '';
            }, this.todoIndex * 50);
        }
        else {
            this.todoVisible = true;
            this.element.style.display = '';
        }
    }

    render() {
        this.updateTodoInfo();

        // Update classes
        this.element.classList.toggle('todo-done', this.doneToday);
        this.element.classList.toggle('todo-today', this.dueToday);
        this.element.classList.toggle('todo-overdue', this.overdue);

        // Update order
        this.element.style.order = this.todoIndex;

        // Update text content
        this.element.querySelector('.last-done-date').textContent = this.lastDoneDate;
        this.element.querySelector('.last-done-ago').textContent = this.lastDoneAgo;
        this.element.querySelector('.todo-text span:first-child').textContent = this.todo.text;

        const countSpan = this.element.querySelector('.todo-count');
        if (!this.todo.repeat) {
            countSpan.textContent = 'x' + this.todo.count;
            countSpan.style.display = '';
        } else {
            countSpan.style.display = 'none';
        }

        this.element.querySelector('.todo-frequency').textContent = this.todo.frequency;
        this.element.querySelector('.next-done-date').textContent = this.nextDoneDate;
        this.element.querySelector('.next-done-in').textContent = this.nextDoneIn;
        this.element.querySelector('.todo-link').href = 'detail.html?todoId=' + this.todo.id;

        // Update button visibility
        const checkButton = this.element.querySelector('.check-button');
        const doneButton = this.element.querySelector('.done-button');
        const removeButton = this.element.querySelector('.remove-button');

        if (!this.doneToday && !(!this.todo.repeat && this.todo.count == 0)) {
            checkButton.style.display = '';
            doneButton.style.display = 'none';
            removeButton.style.display = 'none';
        } else if (this.doneToday && !(!this.todo.repeat && this.todo.count == 0)) {
            checkButton.style.display = 'none';
            doneButton.style.display = '';
            removeButton.style.display = 'none';
        } else if (!this.todo.repeat && this.todo.count == 0) {
            checkButton.style.display = 'none';
            doneButton.style.display = 'none';
            removeButton.style.display = '';
        }
    }
}

// Main app controller
class IndexController {
    constructor() {
        this.todoListController = new TodoListController();
        this.todoItemControllers = [];
        this.todosListElement = null;
    }

    init() {
        this.todosListElement = document.querySelector('.todos-list');

        // Set today's date in header
        const todayElement = document.querySelector('.prioday-today');
        if (todayElement) {
            todayElement.textContent = 'Prioday ' + window.__date.today;
        }

        this.render();
    }

    render() {
        this.todosListElement.innerHTML = '';
        this.todoItemControllers = [];

        if (this.todoListController.todoList.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.todoListController.todoList.forEach((todo, index) => {
            const {element, container} = this.createTodoElement(todo, index);
            this.todosListElement.appendChild(element);

            const controller = new TodoItemController(todo, index, container);
            this.todoItemControllers.push(controller);
            controller.init();
            controller.render();
        });
    }

    renderEmptyState() {
        const template = document.getElementById('empty-state-template');
        const emptyElement = template.content.cloneNode(true);
        this.todosListElement.appendChild(emptyElement);
    }

    createTodoElement(todo, index) {
        const template = document.getElementById('todo-template');
        const clone = template.content.cloneNode(true);
        const container = clone.querySelector('.todo-container');

        // Add event listeners
        const checkButton = clone.querySelector('.check-button button');
        checkButton.addEventListener('click', () => {
            this.todoListController.doneTodo(todo.id);
            this.render();
        });

        const removeButton = clone.querySelector('.remove-button button');
        removeButton.addEventListener('click', () => {
            this.todoListController.removeTodo(todo.id);
            this.render();
        });

        return {element: clone, container: container};
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const indexController = new IndexController();
    indexController.init();
});
