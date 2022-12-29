import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";
import { daysAgo } from "../util/convertdate";
import { next } from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const daySinceLastDone = daysAgo(props.todo.lastDone)
    
    return (
        <li>
            <div style={{ flex: "auto", marginRight: "0.5rem" }}>
                <NavLink to={props.todo.id} >{props.todo.text}</NavLink>
                <div style={{ display: "flex" }}>
                    <span style={{ flex: "auto" }}>{
                        props.todo.repeat ?
                            props.todo.lastDone > 0
                                ? new Date(props.todo.lastDone).toLocaleDateString() + " " + daySinceLastDone 
                                : " new "
                            : " 1 time "}
                    </span>
                    <span>{props.todo.frequency + " " + next(props.todo.lastDone, props.todo.frequency).toLocaleDateString()}</span>
                </div>
            </div>
            {
                    daySinceLastDone > 0 ?
                        <button onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}>Done</button>
                        : ""
                }
        </li>
    );
}

export default Todo;