import React, { useRef } from "react";
import TodoModel from "../models/todo";

const FormTodo: React.FC<{ todo?: TodoModel, onSubmit: (todo: TodoModel) => void }> = (props) => {
    const todoTextInputRef = useRef<HTMLInputElement>(null);
    const isNew = !props.todo;
    let todo = props.todo || new TodoModel();

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const text = todoTextInputRef.current!.value.trim();
        if (text.length === 0) {
            return;
        }

        todo.text = text;

        props.onSubmit(todo);
    };

    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="text">Todo text</label>
            <input type="text" id="text" ref={todoTextInputRef} />
            <button>{isNew ? 'Create Todo' : 'Save Changes'}</button>
        </form>
    );
}

export default FormTodo;