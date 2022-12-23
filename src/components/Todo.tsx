import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    return (
        <li>
            <NavLink to={props.todo.id} >{props.todo.text}</NavLink>
            {props.todo.repeat ? <span>{props.todo.lastDone}</span> : <span>1 time</span>}
            <button onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}>Done</button>
        </li>
    );
}

export default Todo;