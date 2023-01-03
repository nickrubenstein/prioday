import { v4 as uuid } from 'uuid';
import * as Frequency from "../util/frequency";

class TodoModel {
    id: string;
    text: string;
    repeat: boolean;
    frequency: string;
    count: number;
    lastDone: number;
    lastLastDone: number;

    constructor(todo?: TodoModel) {
        if (todo) {
            this.id = todo.id;
            this.text = todo.text;
            this.repeat = todo.repeat;
            this.frequency = todo.frequency;
            this.count = todo.count;
            this.lastDone = todo.lastDone;
            this.lastLastDone = todo.lastLastDone;
        }
        else {
            this.id = uuid();
            this.text = "";
            this.repeat = true;
            this.frequency = "d1";
            this.count = 0;
            this.lastDone = 0;
            this.lastLastDone = 0;
        }
    }
}

export const sortTodoModels = (a: TodoModel, b: TodoModel) => {
    if (a.lastDone === 0) {
        if (b.lastDone !== 0) {
            return -1;
        }
    }
    else {
        if (b.lastDone === 0) {
            return 1;
        }
    }
    const aNext = Frequency.next(a.lastDone, a.frequency).getTime();
    const bNext = Frequency.next(b.lastDone, b.frequency).getTime();
    if (aNext === bNext) {
        return Frequency.sort(a.frequency, b.frequency);
    }
    return aNext - bNext;
};

export default TodoModel;