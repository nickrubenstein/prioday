class TodoModel {
    id: string;
    text: string;
    repeat: boolean;
    lastDone: string;

    constructor(todo?: TodoModel) {
        if (todo) {
            this.id = todo.id;
            this.text = todo.text;
            this.repeat = todo.repeat;
            this.lastDone = todo?.lastDone;
        }
        else {
            this.id = new Date().toISOString();
            this.text = "";
            this.repeat = true;
            this.lastDone = 'never';
        }
    }
}

export default TodoModel;