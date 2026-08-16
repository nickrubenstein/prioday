class DetailController {
    constructor() {
        this.formTodo = {
            id: crypto.randomUUID(),
            text: '',
            repeat: true,
            frequency: window.__cron.formatFrequency('d', 1),
            count: 1,
            lastDone: 0,
            lastLastDone: 0,
            source: 'Device',
        };

        this.formTodoFrequencyUnitValue = 'd';
        this.formTodoFrequencyCountValue = 1;
        this.todoList = [this.formTodo];
        this.todoParamId = null;
        this.isNewTodo = false;
    }

    get formTodoFrequencyUnit() {
        return this.formTodoFrequencyUnitValue;
    }

    set formTodoFrequencyUnit(unit) {
        this.formTodoFrequencyUnitValue = unit;
        this.updateFrequency();
    }

    get formTodoFrequencyCount() {
        return this.formTodoFrequencyCountValue;
    }

    set formTodoFrequencyCount(count) {
        this.formTodoFrequencyCountValue = count;
        this.updateFrequency();
    }

    get formTodoLastDoneDate() {
        if (!this.formTodo.lastDone) {
            return undefined;
        }
        return window.__date.formatDate(this.formTodo.lastDone);
    }

    set formTodoLastDoneDate(date) {
        let offset = (new Date().getTimezoneOffset()) * window.__date.MILLISECONDS_IN_MINUTE;
        this.formTodo.lastDone = Date.parse(date) + offset;
    }

    get todaysDate() {
        return window.__date.formatDate(Date.now());
    }

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
    }

    saveTodoList() {
        localStorage.setItem('todo', JSON.stringify(this.todoList));
    }

    addTodo() {
        const todo = this.todoList.find(t => t.id == this.formTodo.id);
        if (todo) {
            Object.assign(todo, this.formTodo);
        }
        else {
            this.todoList.push(this.formTodo);
        }
        this.saveTodoList();
        window.location.href = 'index.html';
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
            this.formTodo = {...todo};
            this.updateUI();
        }
    }

    undoTodo(todoId) {
        const todo = this.todoList.find(t => t.id == todoId);
        if (todo) {
            todo.lastDone = todo.lastLastDone;
            if (!todo.repeat) {
                todo.count++;
            }
            this.saveTodoList();
            this.formTodo = {...todo};
            this.updateUI();
        }
    }

    removeTodo(todoId) {
        let removeIndex = this.todoList.findIndex(t => t.id == todoId);
        if (removeIndex >= 0) {
            this.todoList.splice(removeIndex, 1);
            this.saveTodoList();
        }
    }

    updateFrequencyDisplay() {
        const { unit, count } = window.__cron.parseFrequency(this.formTodo.frequency);
        this.formTodoFrequencyUnitValue = unit;
        this.formTodoFrequencyCountValue = count;
    }

    updateFrequency() {
        this.formTodo.frequency = window.__cron.formatFrequency(this.formTodoFrequencyUnit, this.formTodoFrequencyCount);
        this.updateFrequencyDisplayText();
    }

    updateFrequencyDisplayText() {
        const displayElement = document.getElementById('frequency-display');
        if (displayElement) {
            displayElement.textContent = this.formTodoFrequencyDisplay;
        }
    }

    updateUI() {
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = this.isNewTodo ? 'New Todo' : 'Details';
        }

        // Update submit button text
        const submitButton = document.querySelector('#save-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = this.isNewTodo ? 'Create' : 'Save Changes';
        }

        // Update form values
        document.getElementById('text').value = this.formTodo.text;
        document.getElementById('repeat').checked = this.formTodo.repeat;

        const countInput = document.getElementById('count');
        if (countInput) {
            countInput.value = this.formTodo.count;
        }

        // Update frequency radio buttons
        const frequencyRadio = document.querySelector(`input[name="frequency"][value="${this.formTodoFrequencyUnit}"]`);
        if (frequencyRadio) {
            frequencyRadio.checked = true;
        }

        document.getElementById('number').value = this.formTodoFrequencyCount;

        const lastDoneInput = document.getElementById('lastDone');
        if (lastDoneInput) {
            if (this.formTodoLastDoneDate) {
                lastDoneInput.value = this.formTodoLastDoneDate;
            }
        }

        // Update count field visibility
        this.updateCountVisibility();

        // Update check/undo button visibility (only for edit mode)
        if (!this.isNewTodo) {
            this.updateButtonVisibility();
        }

        // Show/hide elements based on mode
        this.updateModeVisibility();

        // Update frequency display
        this.updateFrequencyDisplayText();
    }

    updateCountVisibility() {
        const countDiv = document.getElementById('count-div');
        const countInput = document.getElementById('count');
        if (this.formTodo.repeat) {
            countDiv.style.display = 'none';
            countInput.removeAttribute('required');
            countInput.disabled = true;
        } else {
            countDiv.style.display = '';
            countInput.setAttribute('required', 'required');
            countInput.disabled = false;
        }
    }

    updateModeVisibility() {
        const checkForm = document.getElementById('check-form');
        const undoForm = document.getElementById('undo-form');
        const lastDoneDiv = document.getElementById('last-done-div');
        const deleteButton = document.getElementById('delete-button');

        if (this.isNewTodo) {
            // Hide elements for new todo mode
            if (checkForm) checkForm.style.display = 'none';
            if (undoForm) undoForm.style.display = 'none';
            if (lastDoneDiv) lastDoneDiv.style.display = 'none';
            if (deleteButton) deleteButton.style.display = 'none';
        } else {
            // Show elements for edit mode
            if (lastDoneDiv) lastDoneDiv.style.display = '';
            if (deleteButton) deleteButton.style.display = '';
        }
    }

    updateButtonVisibility() {
        const checkForm = document.getElementById('check-form');
        const undoForm = document.getElementById('undo-form');

        const isDoneToday = window.__date.getDate(this.formTodo.lastDone).getTime() == window.__date.getDate().getTime();

        if (isDoneToday) {
            checkForm.style.display = 'none';
            undoForm.style.display = '';
        } else {
            checkForm.style.display = '';
            undoForm.style.display = 'none';
        }
    }

    init() {
        // Get URL parameter
        const params = new URLSearchParams(window.location.search);
        this.todoParamId = params.get('todoId') || null;
        this.isNewTodo = !this.todoParamId;

        // Load todo list
        try {
            this.todoList = JSON.parse(localStorage.getItem('todo')) || [];
            let migrated = false;
            for (const todo of this.todoList) {
                const newFrequency = window.__cron.migrateFrequency(todo.frequency);
                if (newFrequency !== todo.frequency) {
                    todo.frequency = newFrequency;
                    migrated = true;
                }
            }
            if (migrated) {
                this.saveTodoList();
            }
        }
        catch {
            this.todoList = [];
        }

        if (this.todoParamId) {
            const todo = this.todoList.find(t => t.id == this.todoParamId);
            if (todo) {
                this.formTodo = {...todo};
            }
        }

        this.updateFrequencyDisplay();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Check form (only if exists)
        const checkForm = document.getElementById('check-form');
        if (checkForm) {
            checkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.doneTodo(this.formTodo.id);
            });
        }

        // Undo form (only if exists)
        const undoForm = document.getElementById('undo-form');
        if (undoForm) {
            undoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.undoTodo(this.formTodo.id);
            });
        }

        // Save form
        const saveForm = document.getElementById('save-form');
        saveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Delete button (only if exists)
        const deleteButton = document.getElementById('delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeTodo(this.todoParamId);
                window.location.href = 'index.html';
            });
        }

        // Text input
        document.getElementById('text').addEventListener('input', (e) => {
            this.formTodo.text = e.target.value;
        });

        // Repeat checkbox
        document.getElementById('repeat').addEventListener('change', (e) => {
            this.formTodo.repeat = e.target.checked;
            this.updateCountVisibility();
        });

        // Count input
        document.getElementById('count').addEventListener('input', (e) => {
            this.formTodo.count = parseInt(e.target.value) || 0;
        });

        // Frequency radio buttons
        const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
        frequencyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.formTodoFrequencyUnit = e.target.value;
            });
        });

        // Frequency count input
        document.getElementById('number').addEventListener('input', (e) => {
            this.formTodoFrequencyCount = parseInt(e.target.value) || 1;
        });

        // Last done date input (only if exists)
        const lastDoneInput = document.getElementById('lastDone');
        if (lastDoneInput) {
            lastDoneInput.addEventListener('change', (e) => {
                this.formTodoLastDoneDate = e.target.value;
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const detailController = new DetailController();
    detailController.init();
});
