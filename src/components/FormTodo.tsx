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
        const value = event.target.value;
        handleChange('text', value);
    };

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        handleChange('frequency', value);
    };

    const handleRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        handleChange('repeat', value);
    };

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        handleChange('count', value);
    };

    return (
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="text">Task Name</label>
                <input type="text" id="text" value={todo.text} onChange={handleTextChange}/>
            </div>
            <div>
                <label htmlFor="repeat">Repeat Forever</label>
                <label className="switch">
                    <input type="checkbox" id="repeat" checked={todo.repeat} onChange={handleRepeatChange}/>
                    <span className="slider round"></span>
                </label>
            </div>
            { todo.repeat
                ? 
                <div>
                    <label htmlFor="frequency">Frequency</label>
                    <input type="frequency" id="frequency" value={todo.frequency} onChange={handleFrequencyChange}/>
                </div>
                : 
                <div>
                    <label htmlFor="count">Repeat Count</label>
                    <input type="number" id="count" value={todo.count} onChange={handleCountChange}/>
                </div>
            }

            <button>{isNew ? 'Create Task' : 'Save Changes'}</button>
        </form>
    );
}

export default FormTodo;