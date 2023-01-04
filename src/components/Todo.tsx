import { NavLink } from "react-router-dom";
import TodoModel from "../models/todo";
import * as Dates from "../util/dates";
import * as Frequency from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const isNew = props.todo.lastDone === 0;
    const lastDoneDate = Dates.getDate(props.todo.lastDone);
    const daySinceLastDone = Dates.getDaysAgo(lastDoneDate);
    const nextDoneDate = Frequency.next(props.todo.lastDone, props.todo.frequency);
    const daysToNextDone = Dates.getDaysAgo(Dates.getDate(), nextDoneDate);
    const lastDoneDisplay = Dates.getDateString(lastDoneDate);
    const nextDoneDisplay = Dates.getDateString(nextDoneDate);
    const status =
        daySinceLastDone === 0 ? "done" :
            daysToNextDone === 0 || isNew ? "today" :
                daysToNextDone < 0 ? "missed" :
                    "future";
    let statusDisplay = "";
    switch (status) {
        case 'done':
            statusDisplay = 'Done'; break;
        case 'today':
            statusDisplay = 'Todo'; break;
        case 'missed':
            statusDisplay = (-1 * daysToNextDone) + (daysToNextDone === -1 ? ' day' : ' days') + ' overdue'; break;
        case 'future':
            statusDisplay = "in " + daysToNextDone + (daysToNextDone === 1 ? ' day' : ' days'); break;
        default:
    }

    return <li className={"todo-" + status}>
        <NavLink to={props.todo.id} style={{ flex: "auto", marginRight: "0.5rem" }} >
            <div style={{ fontWeight: "bold", overflowWrap: "anywhere" }}>
                {props.todo.text}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexFlow: "wrap" }}>
                <span style={{ width: '90px' }}>{isNew ? "Today" : lastDoneDisplay}</span>
                <span style={{ width: '150px' }}>{statusDisplay}</span>
                <span style={{ width: '90px' }}>{isNew ? "New" : nextDoneDisplay}</span>
            </div>
        </NavLink>
        <div style={{ width: "50px", height: "45px", alignSelf: "center" }}>
                { daySinceLastDone > 0 ?
                <button
                    className={"icon-checkmark2 check-" + status}
                    style={{ fontSize: "2rem", padding: "0.5rem" }}
                    onClick={props.onCheckTodo.bind(null, 'DONE', props.todo)}>
                </button>
                :
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ whiteSpace: "nowrap" }}>
                        {daysToNextDone + (daysToNextDone === 1 ? " day" : " days")}
                    </span>
                    <span style={{ whiteSpace: "nowrap" }}>
                        {props.todo.repeat ? props.todo.frequency : (props.todo.count + " left")}
                    </span>
                </div>
            }</div>
    </li>;
}

export default Todo;