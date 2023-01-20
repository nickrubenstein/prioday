import React, { useContext, useState } from "react";
import TodoModel from "../models/todo";
import { AuthContext } from "../store/auth-context";
import Frequency from "./Frequency";

const FormTodo: React.FC<{ todo?: TodoModel, onSubmit: (todo: TodoModel) => void }> = (props) => {
    const isNew = !props.todo;
    const { user } = useContext(AuthContext);
    const [todo, setTodo] = useState(() => {
        if (isNew) {
            let newTodo = new TodoModel();
            newTodo.source = user ? 'Cloud' : 'Device';
            return newTodo;
        } 
        return new TodoModel(props.todo);
    });

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

    const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        todo.source = event.target.checked ? 'Cloud' : 'Device';
        setTodo(new TodoModel(todo));
    };

    return (
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="text">Task Name</label>
                <input type="text" minLength={1} id="text" value={todo.text} onChange={handleTextChange}/>
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
                    <input type="number" id="count" min={1} value={todo.count} onChange={handleCountChange}/>
                </div>
            }
            { user
                ? 
                <div className="checkmark" style={{ marginBottom: "0.5rem"}}>
                    <label htmlFor="group">Store in { todo.source }</label>
                    <label className="switch">
                        <input type="checkbox" id="group" checked={todo.source !== 'Device'} onChange={handleGroupChange}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                : ''
            }
            <button>{isNew ? 'Create Task' : 'Save Changes'}</button>
        </form>
    );
}

export default FormTodo;