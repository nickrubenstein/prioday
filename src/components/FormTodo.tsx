import React, { useState } from "react";
import TodoModel from "../models/todo";
import Frequency from "./Frequency";

const FormTodo: React.FC<{ todo?: TodoModel, onSubmit: (todo: TodoModel) => void }> = (props) => {
    const isNew = !props.todo;
    const [todo, setTodo] = useState(new TodoModel(props.todo));

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        props.onSubmit(todo);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        todo.text = event.target.value;
        setTodo(new TodoModel(todo));
    };

    const handleRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        todo.repeat = event.target.checked;
        todo.count = todo.repeat ? 0 : 1;
        setTodo(new TodoModel(todo));
    };

    const handleFrequencyChange = (frequency: string) => {
        todo.frequency = frequency;
        setTodo(new TodoModel(todo));
    };

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        todo.count = +event.target.value;
        setTodo(new TodoModel(todo));
    };

    return (
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="text">Task Name</label>
                <input type="text" id="text" value={todo.text} onChange={handleTextChange}/>
            </div>
            <div className="checkmark">
                <label htmlFor="repeat">Repeat Forever</label>
                <label className="switch">
                    <input type="checkbox" id="repeat" checked={todo.repeat} onChange={handleRepeatChange}/>
                    <span className="slider round"></span>
                </label>
            </div>
            { todo.repeat
                ? 
                <Frequency frequency={todo.frequency} onChange={handleFrequencyChange}></Frequency>
                : 
                <div>
                    <label htmlFor="count">Do {todo.count} Time{todo.count === 1 ? '' : 's'}</label>
                    <input type="number" id="count" min="1" value={todo.count} onChange={handleCountChange}/>
                </div>
            }

            <button>{isNew ? 'Create Task' : 'Save Changes'}</button>
        </form>
    );
}

export default FormTodo;