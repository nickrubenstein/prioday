import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";
import { daysAgo } from "../util/convertdate";
import { next } from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const lastDoneDate = new Date(props.todo.lastDone);
    const daySinceLastDone = daysAgo(lastDoneDate);
    const nextDone = next(props.todo.lastDone, props.todo.frequency);
    const daysToNextDone = daysAgo(new Date(), nextDone);
    const status =
        daySinceLastDone === 0 ? "done" :
            daysToNextDone === 0 ? "today" :
                daysToNextDone < 0 ? "missed" :
                    "future";
    let statusDisplay = "";
    switch(status) {
        case 'done': 
            statusDisplay = 'Done'; break;
        case 'today': 
            statusDisplay = 'Todo'; break;
        case 'missed': 
            statusDisplay = (-1 * daysToNextDone) + (daysToNextDone === -1 ? ' day' : ' days') + ' overdue'; break;
        case 'future': 
            statusDisplay = daysToNextDone + (daysToNextDone === 1 ? ' day' : ' days') + ' away'; break;
        default:
    }

    return (
        <li className={"todo-" + status}>
            <NavLink to={props.todo.id} style={{ flex: "auto", marginRight: "0.5rem" }} >
                <div style={{ fontWeight: "bold", overflowWrap: "anywhere" }}>{props.todo.text}</div>
                <div style={{ display: "flex", justifyContent: "space-between", flexFlow: "wrap" }}>
                    <span style={{width: '90px'}}>{props.todo.lastDone > 0 ? lastDoneDate.toLocaleDateString() : "new"}</span>
                    <span style={{width: '150px'}}>{statusDisplay}</span>
                    <span style={{width: '90px'}}>{nextDone.toLocaleDateString()}</span>
                </div>
            </NavLink>
            <div style={{width: '50px', height: '45px'}}>{
                daySinceLastDone > 0 ?
                    <button className="icon-checkmark check" onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}></button>
                    :
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <span style={{whiteSpace: "nowrap"}}>{daysToNextDone + (daysToNextDone === 1 ? " day" : " days")} </span>
                        <span style={{whiteSpace: "nowrap"}}>{props.todo.count + (props.todo.repeat ? " done" : " left")} </span>
                    </div>
            }</div>
        </li>
    );
}

export default Todo;