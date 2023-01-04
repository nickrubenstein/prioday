import React, { useState } from "react";
import TodoModel from "../models/todo";

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

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        todo.frequency = event.target.value;
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