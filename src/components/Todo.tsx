import { useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import TodoModel from "../models/todo";
import { AuthContext } from "../store/auth-context";
import * as Dates from "../util/dates";
import * as Frequency from "../util/frequency";

const Todo: React.FC<{ todo: TodoModel; index: number, onCheckTodo: (action: string, todo: TodoModel) => void }> = (props) => {
    const { user } = useContext(AuthContext);
    const nodeRef = useRef(null);
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
    const transitionDelay = props.index * 50;

    return <CSSTransition nodeRef={nodeRef} in={true} appear={true} classNames="todo-item" timeout={transitionDelay + 500}>
        <li ref={nodeRef} className={"todo-" + status} style={{ transitionDelay: transitionDelay + 'ms'}}>
            <NavLink to={props.todo.id} style={{ flex: "auto", marginRight: "0.5rem" }} >
                <div style={{ fontWeight: "bold", overflowWrap: "anywhere" }}>
                    {props.todo.text}
                    { user ? 
                        <span className={props.todo.source === 'Cloud' ? 'icon-cloud' : ''}
                            style={{ float: 'right', color: 'var(--text-secondary)'}}>
                        </span>
                        : ""
                    }
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
        </li>
    </CSSTransition>;
}

export default Todo;