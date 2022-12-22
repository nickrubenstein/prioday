import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";

const Todo: React.FC<{ todo: TodoModel; onRemoveTodo: () => void }> = (props) => {
    return (
        <li>
            <NavLink to={props.todo.id} >{props.todo.text}</NavLink>
            <button onClick={props.onRemoveTodo}>Done</button>
        </li>
    );
}

export default Todo;