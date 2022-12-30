class TodoModel {
    id: string;
    text: string;
    repeat: boolean;
    frequency: string;
    count: number;
    lastDone: number;

    constructor(todo?: TodoModel) {
        if (todo) {
            this.id = todo.id;
            this.text = todo.text;
            this.repeat = todo.repeat;
            this.frequency = todo.frequency;
            this.count = todo.count;
            this.lastDone = todo?.lastDone;
        }
        else {
            this.id = new Date().toISOString();
            this.text = "";
            this.repeat = true;
            this.frequency = "d1";
            this.count = 0;
            this.lastDone = 0;
        }
    }
}

export default TodoModel;