class TodoModel {
    id: string;
    text: string;

    constructor(todo?: string) {
        this.text = todo || "new todo";
        this.id = new Date().toISOString();
    }
}

export default TodoModel;