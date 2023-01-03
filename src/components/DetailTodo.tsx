import React, { Fragment, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import TodoModel from "../models/todo";
import { TodosContext } from "../store/todos-context";
import * as Dates from "../util/dates";
import FormTodo from "./FormTodo";

const DetailTodo: React.FC = () => {
    const todosCtx = useContext(TodosContext);
    const { todoId } = useParams();
    const navigate = useNavigate();
    
    const todo = todosCtx.todos.find(t => t.id === todoId);
    if (!todo) {
        return <h1>Could not find Todo {todoId}</h1>;
    }

    const lastDoneDate = Dates.getDate(todo.lastDone);
    const daySinceLastDone = Dates.getDaysAgo(lastDoneDate);

    const submitHandler = (todo: TodoModel) => {
        todosCtx.replaceTodo(todo);
    };

    const deleteHandler = (event: React.MouseEvent) => {
        todosCtx.deleteTodo(todo);
        navigate("/todo");
    };

    const undoHandler = (event: React.MouseEvent) => {
        todosCtx.undoTodo(todo);
    };

    return <Fragment>
        <h1>
            <NavLink to="/todo"><span className="icon-undo2 margin-left"></span></NavLink>
            Edit Task
            <span className="icon-bin margin-right" onClick={deleteHandler}></span>
        </h1>
        <section>
            <FormTodo todo={todo} onSubmit={submitHandler} />
            { daySinceLastDone === 0 ? <button onClick={undoHandler}>Undo check</button> : "" }
            <div>{JSON.stringify(todo, null, 2)}</div>
        </section>
    </Fragment>;
}

export default DetailTodo;