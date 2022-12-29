import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";
import { daysAgo } from "../util/convertdate";
import { next } from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const daySinceLastDone = daysAgo(props.todo.lastDone)
    
    return (
        <li>
            <NavLink to={props.todo.id} >{props.todo.text}</NavLink>
            <span>{ " " + props.todo.frequency + " " }</span>
            <span>{
                props.todo.repeat ?
                    props.todo.lastDone > 0
                        ? " " + daySinceLastDone + "\tlast " + new Date(props.todo.lastDone).toLocaleDateString()
                        : " new "
                    : " 1 time "}
            </span>
            {
                daySinceLastDone > 0 ?
                    <button onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}>Done</button>
                    : ""
            }
            <span>{",\tnext " + next(props.todo.lastDone, props.todo.frequency).toLocaleDateString()}</span>
        </li>
    );
}

export default Todo;