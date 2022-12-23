import React, { useState } from "react";
import TodoModel from "../models/todo";

const FormTodo: React.FC<{ todo?: TodoModel, onSubmit: (todo: TodoModel) => void }> = (props) => {
    const isNew = !props.todo;
    const [todo, setTodo] = useState(props.todo || new TodoModel());

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        props.onSubmit(todo);
    };

    const handleChange = (formKey: string, value: any) => {
        let t: any = new TodoModel(todo);
        if (t[formKey] === value) {
            return;
        }
        t[formKey] = value;
        setTodo(t);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        if (value.length === 0) {
            return;
        }
        handleChange('text', value);
    };

    const handleRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        handleChange('repeat', value);
    };

    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="text">Todo text</label>
            <input type="text" id="text" value={todo.text} onChange={handleTextChange}/>
            <label htmlFor="repeat">Repeat</label>
            <input type="checkbox" id="repeat" checked={todo.repeat} onChange={handleRepeatChange}/>
            <button>{isNew ? 'Create Todo' : 'Save Changes'}</button>
        </form>
    );
}

export default FormTodo;