import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";
import { daysAgo } from "../util/convertdate";
import { next } from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const lastDoneDate = new Date(props.todo.lastDone);
    const daySinceLastDone = daysAgo(lastDoneDate);
    const nextDone = next(props.todo.lastDone, props.todo.frequency);
    const daysToNextDone = daysAgo(new Date(), nextDone);
    const statusClass = 
        daySinceLastDone === 0 ? "todo-done" :
        daysToNextDone === 0 ? "todo-today" :
        daysToNextDone < 0 ? "todo-missed" :
        "todo-future";
    
    return (
        <li className={statusClass}>
            <div style={{ flex: "auto", marginRight: "0.5rem" }}>
                <NavLink to={props.todo.id} >{props.todo.text}</NavLink>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <span>{ props.todo.lastDone > 0 ? lastDoneDate.toLocaleDateString() : "newly created" }</span>
                    <span>{
                        props.todo.lastDone > 0 ?
                        (daySinceLastDone == 0 ? "done today" : " done " + daySinceLastDone + " days ago")
                        : "never done"
                    }
                    </span>
                    <span>{(props.todo.repeat ? props.todo.frequency : "") + " " 
                        + nextDone.toLocaleDateString()}
                    </span>
                </div>
            </div>
            {
                daySinceLastDone > 0 ?
                    <button onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}>Done</button>
                    : 
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{ daysToNextDone + (daysToNextDone == 1 ? " day" : " days") } </span>
                        <span>{ props.todo.count + (props.todo.repeat ? " done" : " left") } </span>
                    </div>
            }
        </li>
    );
}

export default Todo;