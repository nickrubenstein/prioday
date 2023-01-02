import { v4 as uuid } from 'uuid';

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
            this.id = uuid();
            this.text = "";
            this.repeat = true;
            this.frequency = "d1";
            this.count = 0;
            this.lastDone = 0;
        }
    }
}

export default TodoModel;